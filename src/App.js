import React, { Component } from 'react'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import './bulma.css'

const bots = require('./bots.json')

const flatMap = (arr, f) => [].concat.apply([], arr.map(f))

const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex
  
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const Header = () => (
  <div>
    <section className="hero is-info is-bold">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title">
            Discord Music Bots
          </h1>
          <h2 className="subtitle">
            discordmusicbots.com
          </h2>
        </div>
      </div>
    </section>
    <br />
  </div>
);

class Features extends Component {
  render() {
    return (
      <div className="container">
        <div className="" style={{
          padding: "2em 2em 1em 2em",
        }}>
          <div className="is-grouped is-grouped-multiline">
            <div className="content">
              <h3>Choose a feature you're looking for:</h3>
            </div>
            <NavLink className="button is-light" to="/" style={{
              margin: "0 0.5em 0.5em 0"
            }}>
              All features
            </NavLink>
            {[... new Set(flatMap(this.props.bots.map(bot => bot.tags), tags => tags).sort())].map(tag => (
              <NavLink className="button" key={tag} to={"/" + tag.toLowerCase()} style={{
                margin: "0 0.5em 0.5em 0"
              }}>
                {tag}
              </NavLink>
            ))}
          </div>
          <hr />
        </div>
      </div>
    )
  }
}

class BotHeader extends Component {
  constructor(props) {
    super(props)
    this.bot = this.props.bot
    console.log("bot: " + JSON.stringify(this.bot))
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-narrow">
          <img src={this.bot.image} alt={this.bot.name + "'s avatar"} style={{ height: "144px" }} />
        </div>
        <div className="column">
          <div className="content">
            <NavLink to={"/bots/" + this.bot.name.toLowerCase()}><h3>{this.bot.name}</h3></NavLink>
            <p>{this.bot.description}</p>
            <div className="tags">
              {this.bot.tags.sort().map(tag => (
                <span className="tag" key={tag}>{tag}</span>
              ))}
            </div>
            <p>
              {(this.bot.invite !== undefined && this.bot.invite.length > 0) && (
                <a className="button is-info" href={this.bot.invite} style={{ marginRight: "0.5em" }}>
                  Add to your server
                </a>
              )}
              {(this.bot.support !== undefined && this.bot.support.length > 0) && (
                <a className="button" href={this.bot.support} style={{ marginRight: "0.5em" }}>
                  Support server
                </a>
              )}
              {(this.bot.website !== undefined && this.bot.website.length > 0) && (
                <a className="button" href={this.bot.website} style={{ marginRight: "0.5em" }}>
                  Website
                </a> 
              )}
              {(this.bot.twitter !== undefined && this.bot.twitter.length > 0) && (
                <a className="button" href={this.bot.twitter}>
                  Twitter
                </a>
              )}
            </p>
          </div>
        </div>
      </div>        
    )
  }
}

class Bots extends Component {
  render() {
    return (
      <div>
        <div className="columns">
          <div className="column">
            <section>
              <div className="container">
                {shuffle(this.props.bots).map(bot => (
                  <div key={bot.id}>
                    <div className="" style={{
                      padding: "2em 2em 1em 2em",
                    }}>
                      <BotHeader bot={bot} />
                      <hr />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

class Index extends Component {
  render() {
    return (
      <div>
        <Bots bots={this.props.bots} />
      </div>
    )
  }
}

class Tags extends Component {
  render() {
    let tag = this.props.match.params.tag;
    let tagUppercase = tag.charAt(0).toUpperCase() + tag.substring(1);
    
    let bots = this.props.bots
      .filter(bot => bot.tags.map(tag => tag.toLowerCase())
      .includes(tag));

    return (
      <div>
        <Helmet>
          <title>{tagUppercase} Discord Music Bots | discordmusicbots.com</title>
        </Helmet>
        <Bots bots={bots} />
      </div>
    )
  }
}

class BotProfile extends Component {
  resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }


  render() {
    let name = this.props.match.params.name;
    let bot = this.props.bots.filter(bot => bot.name.toLowerCase() === name.toLowerCase())[0];

    return (
      <div className="columns">
        <div className="column">
          <div className="container">
            <div style={{ padding: "2em 2em 1em 2em" }}>
              <BotHeader bot={bot} />
              <iframe src={bot.website} width="100%" height="1000px" />
              <hr />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Footer = () => (
  <section className="hero has-text-centered">
    <div className="hero-body">
      <div className="container">
        <div className="content">
          <p>Managed by spong#3338 (87164639695110144)</p>
          <p><a href="https://github.com/ducc/discordmusicbots.com">GitHub</a></p>
          <p>Not affiliated with, endorsed, sponsored, or specifically approved by Discord Inc.</p>
        </div>
      </div>
    </div>
  </section>
)

export default () => (
  <Router>
    <div>
      <Header />
      <div>
        <Features bots={bots} />
        <Route exact path="/" render={props => 
          <Index {...props} bots={bots} />
        } />
        <Route path="/bots/:name" render={props => 
          <BotProfile {...props} bots={bots} />
        } />
        <Route path="/:tag" render={props => 
          <Tags {...props} bots={bots} />
        } />
      </div>
      <section className="hero has-text-centered">
        <div className="hero-body">
          <div className="container">
            <div className="content">
              <h3>Looking for a discord bot that does more than music?</h3>
              <p>Check out <a href="https://botlist.space">botlist.space</a> for bots providing moderation, games, economy and more!</p>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <Footer />
    </div>
  </Router>
)
