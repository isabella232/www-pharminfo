#!/usr/bin/env python
from flask import Flask, abort, current_app, render_template, request
from jinja2.exceptions import TemplateNotFound
import mandrill


app = Flask(__name__)
app.config.from_envvar('WWW_PHARMINFO_CONFIG', silent=True)

ACCESS_TOKEN = app.config.get('ACCESS_TOKEN')
MANDRILL_KEY = app.config.get('MANDRILL_KEY')


@app.route('/')
@app.route('/<page>')
def page(page='index'):
    try:
        return render_template('{}.html'.format(page), page=page)
    except TemplateNotFound:
        abort(404)


@app.route('/clients')
@app.route('/clients/<department>')
def clients(department=None):
    # TODO
    return render_template('clients.html', department=department)


@app.route('/news')
def news():
    # TODO
    return render_template('news.html')


@app.route('/register', methods=('GET', 'POST'))
def register():
    # TODO
    return render_template('register.html')


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.route('/make_contact', methods=['POST'])
def make_contact():
    mandrill_client = mandrill.Mandrill(MANDRILL_KEY)
    form = request.form
    message = {
        'to': [{'email': 'contact@pharminfo.fr'}],
        'subject': 'Prise de contact sur le site de Pharminfo.fr',
        'from_email': 'contact@pharminfo.fr',
        'html': '<br>'.join([
            'Email : %s' % form['email'], 'Nom / Société: %s' % form['name'],
            'Demande : %s ' % form['question']])}
    if not current_app.debug:
        mandrill_client.messages.send(message=message)
    return ''


if __name__ == '__main__':
    from sassutils.wsgi import SassMiddleware
    app.wsgi_app = SassMiddleware(app.wsgi_app, {
        'pharminfo': ('static', 'static', '/static')})
    app.run(debug=True, host='0.0.0.0')
