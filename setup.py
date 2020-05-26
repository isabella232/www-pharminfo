from setuptools import find_packages, setup

tests_requirements = [
    'pytest',
    'pytest-cov',
    'pytest-flake8',
    # pytest-isort >=1 triggers test failures because `top_model` is not
    # installed as dependency.
    # Installing `top_model` would require adding private key to the CI
    # process (TODO).
    'pytest-isort<1',
]

setup(
    name="www-pharminfo",
    version="0.1.dev0",
    description="Website for Pharminfo.fr",
    url="https://www.pharminfo.fr",
    author="Kozea",
    packages=find_packages(),
    include_package_data=True,
    scripts=['pharminfo.py'],
    install_requires=[
        'Flask',
        'mandrill-37',
        'libsass',
    ],
    tests_require=tests_requirements,
    extras_require={'test': tests_requirements}
)
