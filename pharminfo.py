#!/usr/bin/env python
from flask import (
    Flask, abort, current_app, flash, redirect, render_template, request)
from jinja2.exceptions import TemplateNotFound
import mandrill


app = Flask(__name__)
app.config['SECRET_KEY'] = 'default secret key'
app.config.from_envvar('WWW_PHARMINFO_CONFIG', silent=True)


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


@app.route('/contact', methods=('POST',))
def contact():
    if 'phone' in request.form:
        html = 'Rappeler le numéro {}'.format(request.form['phone'])
    else:
        html = '<br>'.join([
            'Email : %s' % request.form['email'],
            'Message : %s ' % request.form['message']])
    message = {
        'to': [{'email': 'contact@pharminfo.fr'}],
        'subject': 'Prise de contact sur le site de Pharminfo.fr',
        'from_email': 'contact@pharminfo.fr',
        'html': html}
    if not current_app.debug:
        mandrill_client = mandrill.Mandrill(app.config.get('MANDRILL_KEY'))
        mandrill_client.messages.send(message=message)
    flash(
        'Merci de nous avoir contacté, nos équipes vous recontacteront '
        'dans les plus brefs délais.')
    return redirect('')


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    from sassutils.wsgi import SassMiddleware
    app.wsgi_app = SassMiddleware(app.wsgi_app, {
        'pharminfo': ('static', 'static', '/static')})
    app.run(debug=True, host='0.0.0.0')
