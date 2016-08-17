#!/usr/bin/env python

from email.utils import parsedate_to_datetime
from flask import (
    Flask, abort, current_app, flash, redirect, render_template,
    request, url_for)
from jinja2.exceptions import TemplateNotFound
from locale import LC_ALL, setlocale
from mandrill import Mandrill
from top_model.public import Client, ClientType, db
from urllib.request import urlopen
from xml.etree import ElementTree


app = Flask(__name__)
app.config['SECRET_KEY'] = 'default secret key'
app.config['DB'] = 'pgfdw://hydra@localhost/hydra'
app.config.from_envvar('WWW_PHARMINFO_CONFIG', silent=True)

setlocale(LC_ALL, 'fr_FR')


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


@app.route('/')
@app.route('/<page>')
def page(page='index'):
    extra = {'news': get_news()[:2]} if page == 'index' else {}
    try:
        return render_template('{}.html'.format(page), page=page, **extra)
    except TemplateNotFound:
        abort(404)


@app.route('/clients')
@app.route('/clients/<int:department>')
def clients(department=None):
    if department:
        clients = list(
            Client.query.join(ClientType)
            .filter(
                (ClientType.domain == 'pharminfo') &
                (Client.current_contract != None) &
                (Client.zip.like('%{:02d}%'.format(department))) &
                (Client.domain != None))
            .all())
        print(clients)
    else:
        clients = []
    return render_template(
        'clients.html', department=department, clients=clients)


@app.route('/news')
def news():
    return render_template('news.html', news=get_news())


@app.route('/register', methods=['POST'])
def register():
    if not all(request.form[key] for key in ('siret', 'phone')):
        if not request.form['siret']:
            flash('Merci de nous indiquer votre SIRET.', 'error')
        if not request.form['phone']:
            flash('Merci de nous indiquer votre numéro de téléphone.', 'error')
        return redirect(url_for('page', page='register'))
    html = '<br>'.join((
        'SIRET : %s' % request.form['siret'],
        'Téléphone : %s' % request.form['phone'],
        'Fax : %s' % request.form['fax'],
        'Email : %s' % request.form['email']))
    send_mail('Nouvelle inscription sur le site de Pharminfo.fr', html)
    return redirect(url_for('page'))


@app.route('/whitepaper', methods=['POST'])
def whitepaper():
    if not all(request.form[key] for key in ('name', 'email', 'function')):
        if not request.form['name']:
            flash('Merci de nous indiquer votre nom.', 'error')
        if not request.form['email']:
            flash('Merci de nous indiquer votre adresse email.', 'error')
        if not request.form['function']:
            flash(
                'Merci de nous indiquer la fonction que vous occupez dans '
                'votre société.', 'error')
        return redirect(url_for('page', page='whitepaper'))
    html = '<br>'.join((
        'Nom : %s' % request.form['name'],
        'Email : %s' % request.form['email'],
        'Fonction : %s' % request.form['function'],
        'Téléphone : %s' % request.form['phone'],
        'Société : %s' % request.form['company']))
    send_mail('Téléchargement du livre blanc Pharminfo.fr', html)
    return redirect(url_for('static', filename='whitepaper.pdf'))


@app.route('/contact', methods=('POST',))
def contact():
    if 'phone' in request.form:
        html = 'Rappeler le numéro {}'.format(request.form['phone'])
    else:
        html = '<br>'.join((
            'Email : %s' % request.form['email'],
            'Message : %s ' % request.form['message']))
    send_mail('Prise de contact sur le site de Pharminfo.fr', html)
    flash(
        'Merci de nous avoir contacté, nos équipes vous recontacteront '
        'dans les plus brefs délais.')
    return redirect(url_for('page'))


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


db.configure(app.config['DB']).assign_flask_app(app)

if __name__ == '__main__':
    from sassutils.wsgi import SassMiddleware
    app.wsgi_app = SassMiddleware(app.wsgi_app, {
        'pharminfo': ('static', 'static', '/static')})
    app.run(debug=True, host='0.0.0.0')
