#!/usr/bin/env python

import json
from email.utils import parsedate_to_datetime
from locale import LC_ALL, setlocale
from urllib.parse import urlencode
from urllib.request import urlopen
from xml.etree import ElementTree

from flask import (
    abort, current_app, flash, Flask, jsonify, redirect, render_template,
    request, url_for)
from jinja2.exceptions import TemplateNotFound
from mandrill import Mandrill
from sqlalchemy.orm import joinedload, undefer
from top_model import db
from top_model.public import Client, ClientType, Contract, Offer


app = Flask(__name__)
app.config['DB'] = 'pgfdw://hydra@localhost/hydra'
app.config['SECRET_KEY'] = 'default secret key'
app.config['RECAPTCHA_KEY'] = 'default recaptcha key'
app.config.from_envvar('WWW_PHARMINFO_CONFIG', silent=True)

setlocale(LC_ALL, 'fr_FR')

RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify'


def send_mail(title, html):
    message = {
        'to': [{'email': 'contact@pharminfo.fr'}],
        'from_email': 'contact@pharminfo.fr',
        'subject': title,
        'html': html}
    if not current_app.debug:
        mandrill_client = Mandrill(app.config.get('MANDRILL_KEY'))
        mandrill_client.messages.send(message=message)


def get_news():
    tree = ElementTree.parse(urlopen(
        'https://kozeagroup.wordpress.com/category/pharminfo-fr/feed/'))
    news = []
    for item in tree.find('channel').findall('item'):
        date = parsedate_to_datetime(item.find('pubDate').text)
        entry = {
            'title': item.find('title').text,
            'description': item.find('description').text,
            'link': item.find('link').text,
            'isodate': date.strftime('%Y-%m-%d'),
            'date': date.strftime('%d %B %Y')}
        image = item.find(
            'media:thumbnail',
            namespaces={'media': 'http://search.yahoo.com/mrss/'})
        if image is not None:
            entry['image'] = image.attrib['url']
        news.append(entry)
    return news


def check_recaptcha(request):
    try:
        data = urlencode({
            'secret': app.config['RECAPTCHA_KEY'],
            'response': request.form['g-recaptcha-response'],
            'remoteip': request.remote_addr}).encode('ascii')
        with urlopen(RECAPTCHA_URL, data=data) as response:
            data = response.read()
            success = json.loads(data.decode('ascii'))['success']
        return success
    except:
        return False


@app.route('/')
@app.route('/<page>')
def page(page='index'):
    extra = {'news': get_news()[:2]} if page == 'index' else {}
    try:
        return render_template('{}.html'.format(page), page=page, **extra)
    except TemplateNotFound:
        abort(404)


@app.route('/news')
def news():
    return render_template('news.html', news=get_news(), page='news')


@app.route('/clients')
@app.route('/clients/<int:department>')
def clients(department=None):
    clients = (
        Client.query.join(ClientType).
        filter(
            (ClientType.domain == 'pharminfo') &
            (Client.current_contract != None) &
            (Client.domain != None)))
    if department:
        clients = clients.filter(Client.zip.like('%s%%' % department))
    clients = clients.all()
    return render_template(
        'clients.html', page='news', department=department, clients=clients)


@app.route('/clients/latlng')
def get_clients_latlng():
    clients = (
        Client.query.join(Contract, 'current_contract')
        .join(Offer).options(undefer('full_domain'))
        .options(joinedload('current_offer'))
        .filter(
            (Contract.clienttype_domain == 'pharminfo') &
            (Client.current_contract != None) &
            (Offer.offer_for_test == current_app.debug))
        .all())
    json_client = []
    for client in clients:
        modules = [m.module_code for m in client.current_offer.moduleoffers]
        if 'ecommerce' in modules:
            offer = 'ecommerce'
        elif 'patient_order' in modules:
            offer = 'patientorder'
        else:
            offer = 'eco'
        json_client.append(
            (client.latlng(not current_app.debug), client.title, offer,
             client.full_domain, client.address))
    return jsonify(json_client)


@app.route('/newsletter', methods=['POST'])
def newsletter():
    html = 'Inscription à la newsletter www pharminfo<br>Email : %s' % (
        request.form['newsletter-email'])
    send_mail('Inscription à la newsletter www pharminfo', html)
    return 'Ok'


@app.route('/subscribe', methods=['GET', 'POST'])
def subscribe():
    if request.method == 'POST':
        if not check_recaptcha(request):
            flash(
                'Veuillez cocher la case '
                'signifiant que vous n\'êtes pas un robot', 'error')
            return render_template(
                'subscribe.html', page='subscribe', data=request.form)
        if not all(request.form[key] for key in ('siret', 'phone')) and (
                not request.form['email']):
            flash('Veuillez remplir au moins un des deux formulaires', 'error')
            return render_template(
                'subscribe.html', page='subscribe', data=request.form)
        html = '<br>'.join((
            'SIRET : %s' % request.form['siret'],
            'Code promo : %s' % request.form.get('code', 'Aucun'),
            'Téléphone : %s' % request.form['phone'],
            'Fax : %s' % request.form['fax'],
            'Email : %s' % request.form['email']))
        send_mail('Nouvelle inscription sur le site de Pharminfo.fr', html)
        return redirect(url_for('page'), code=303)
    return render_template('subscribe.html', page='subscribe')


@app.route('/whitepaper', methods=['POST'])
def whitepaper():
    if not all(request.form[key] for key in (
            'name', 'email', 'function', 'white_paper_choice')):
        if not request.form['name']:
            flash('Merci de nous indiquer votre nom.', 'error')
        if not request.form['email']:
            flash('Merci de nous indiquer votre adresse email.', 'error')
        if not request.form['function']:
            flash(
                'Merci de nous indiquer la fonction que vous occupez dans '
                'votre société.', 'error')
        if not request.form['white_paper_choice']:
            flash('Merci de choisir le livre blanc à télécharger.', 'error')
        return redirect(url_for('page', page='whitepaper'))
    html = '<br>'.join((
        'Nom : %s' % request.form['name'],
        'Email : %s' % request.form['email'],
        'Fonction : %s' % request.form['function'],
        'Téléphone : %s' % request.form['phone'],
        'Société : %s' % request.form['company']))
    send_mail('Téléchargement du livre blanc Pharminfo.fr', html)
    whitepaper = '_'.join(request.form.getlist('white_paper_choice'))
    return redirect(url_for('static', filename='%s.pdf' % whitepaper))


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        if not check_recaptcha(request):
            flash(
                'Veuillez cocher la case '
                'signifiant que vous n\'êtes pas un robot', 'error')
            return render_template(
                'index.html', page='index', data=request.form)
        if 'name' in request.form:
            html = '<br>'.join((
                'Nom : %s' % request.form['name'],
                'Email : %s' % request.form['email'],
                'Société : %s' % request.form['company'],
                'Téléphone : %s' % request.form['phone'],
                'Code promo : %s' % request.form.get('code', 'Aucun'),
                'Message : %s ' % request.form['message']))
        else:
            html = 'Rappeler le numéro {}'.format(request.form['phone'])
        send_mail('Prise de contact sur le site de Pharminfo.fr', html)
        flash(
            'Merci de nous avoir contactés, nos équipes vous recontacteront '
            'dans les plus brefs délais.', 'info')
    return redirect(url_for('page') + '#contact')


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


db.configure(app.config['DB']).assign_flask_app(app)


if __name__ == '__main__':
    from sassutils.wsgi import SassMiddleware
    app.wsgi_app = SassMiddleware(app.wsgi_app, {
        'pharminfo': ('static', 'static', '/static')})
    app.run(debug=True, host='0.0.0.0')
