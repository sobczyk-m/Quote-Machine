import React from 'react'
import './quoteBox.css'
import * as $ from 'jquery'

class QuoteBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            quotes: ["loading quote..."],
            authors: ["loading author..."],
            quotesPage: 0,
            randomNumber: 0
        }

        this.getQuotes = this.getQuotes.bind(this)
        this.changeColors = this.changeColors.bind(this)
        this.updateTweetButton = this.updateTweetButton.bind(this)
        this.setRandomNumber = this.setRandomNumber.bind(this)
        this.deleteQuote = this.deleteQuote.bind(this)
    }

    async getQuotes() {
        const response = await fetch("https://api.quotable.io/quotes?limit=100&page=" + (this.state.quotesPage + 1))
        const data = await response.json()

        if (response.ok) {
            console.log(data)
            if (data["results"].length > 0) {
                const quotesToReturn = []
                const authorsToReturn = []

                data["results"].forEach(obj => {
                    quotesToReturn.push(obj["content"])
                    authorsToReturn.push(obj["author"])
                })

                this.setState(previousState => {
                    return {
                        quotes: quotesToReturn,
                        authors: authorsToReturn,
                        quotesPage: previousState.quotesPage + 1
                    }
                }, () => {
                    this.setRandomNumber()
                    this.changeColors()
                })
            } else {
                this.setState({
                        quotes: ["Sorry, no more new quotes :("],
                        authors: []
                    }
                    , () => {
                        this.setRandomNumber()
                        this.changeColors()
                    })
            }
        } else {
            console.log(data)
            this.setState(
                {
                    quotes: ["An error occurred"],
                    authors: ["An error occurred"]
                })
        }
    }

    setRandomNumber() {
        const drawnNumber = Math.floor(Math.random() * this.state.authors.length)
        this.setState({
            randomNumber: drawnNumber
        })
    }

    deleteQuote() {
        if (this.state.quotes.length === 1 || this.state.authors.length === 1) {
            this.getQuotes()
        } else {
            this.setState({
                quotes: this.state.quotes.filter((_, index) => index !== this.state.randomNumber),
                authors: this.state.authors.filter((_, index) => index !== this.state.randomNumber),
            }, () => {
                this.setRandomNumber()
                this.changeColors()
            })
        }
    }

    changeColors() {
        const colorsList = [
            "#2a9d8f", "#e9c46a", "#606c38", "#0096c7",
            "#52796f", "#003049", "#8d99ae", "#9f86c0",
            "#006d77", "#83c5be", "#6930c3", "#822faf",
            "#6411ad", "#d1495b", "#2b9348", "#007f5f",
            "#76c893", "#8f2d56", "#212f45", "#5a2a27",
            "#413d45", "#4c3957", "#2e294e", "#004346",
            "#43aa8b", "#38040e", "#640d14", "#ff6b6b"
        ]
        let drawnNumber = Math.floor(Math.random() * colorsList.length)
        const previousColor = document.documentElement.style.getPropertyValue('--primary-color')
        while (previousColor === colorsList[drawnNumber]) {
            drawnNumber = Math.floor(Math.random() * colorsList.length)
        }

        $(document).ready(function () {
            document.documentElement.style.setProperty('--primary-color', colorsList[drawnNumber])
            $('body').addClass('background-color-animation')
            $('#new-quote').addClass('new-quote-color-animation')
            $('#quote-box').css('animation', 'none')
            $('.fa-square-twitter').addClass('tweet-btn-color-animation')
            document.documentElement.style.setProperty('--last-color', previousColor)
            setTimeout(function () {
                $('body').removeClass('background-color-animation')
                $('#new-quote').removeClass('new-quote-color-animation')
                $('.fa-square-twitter').removeClass('tweet-btn-color-animation')
                $('#quote-box').css('animation', 'shadow-flickering 2s linear 2s infinite alternate')
            }, 1500)
        })
    }

    updateTweetButton() {
        const tweetButton = document.querySelector("#tweet-quote")
        const link =
            "https://twitter.com/intent/tweet?text=" + encodeURIComponent('"' + this.state.quotes[this.state.randomNumber] + '" '
                + this.state.authors[this.state.randomNumber])
        tweetButton.setAttribute("href", link)
    }

    componentDidMount() {
        this.getQuotes()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateTweetButton()
    }

    render() {
        return (
            <React.Fragment>
                <p id="text">
                    <i className="fa-solid fa-quote-left fa-xl"></i>
                    {" " + this.state.quotes[this.state.randomNumber] + " "}
                    <i className="fa-solid fa-quote-right fa-xl"></i></p>
                <p id="author">~ {this.state.authors[this.state.randomNumber]}</p>
                <div className="container">
                    <a id="tweet-quote" target="_blank" rel="noreferrer" href="https://twitter.com/intent/tweet?">
                        <i className="fa-brands fa-square-twitter fa-2xl"></i>
                    </a>
                    <button id="new-quote" onClick={this.deleteQuote}>
                        New quote
                    </button>
                </div>
            </React.Fragment>
        )
    }
}

export default QuoteBox
