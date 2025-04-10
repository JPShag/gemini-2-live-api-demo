from setuptools import setup, find_packages

setup(
    name="gemini-live-client",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "PyQt6>=6.5.0",
        "google-generativeai>=0.7.0",
        "opencv-python>=4.8.0",
        "numpy>=1.25.0",
    ],
    entry_points={
        'console_scripts': [
            'gemini-live-client=examples.live_api_gui:main',
        ],
    },
    author="Gemini API Demo",
    author_email="example@example.com",
    description="A GUI client for Google's Gemini Live API",
    keywords="gemini, google, ai, live, api, client",
    python_requires='>=3.8',
)