import React, { Component } from 'react'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import 'axios'
import './bulma.css'
import Axios from 'axios';
const util = require('util')
const bots = require('./bots.json')
const shuffle = require('shuffle-array')

const flatMap = (arr, f) => [].concat.apply([], arr.map(f))

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
    let tags = [...new Set(flatMap(this.props.bots.map(bot => bot.tags), tags => tags).sort())];

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
            {tags.map(tag => (
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
  }

  render() {
    let tags = this.bot.tags.sort()

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
              {tags.map(tag => (
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
    let bots = shuffle(this.props.bots);

    return (
      <div>
        <div className="columns">
          <div className="column">
            <section>
              <div className="container">
                {bots.map(bot => (
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

const BFD_URL = "https://botsfordiscord.com/api/v1/bots/%s"

class BotMeta extends Component {
  constructor(props) {
    super(props)
    this.bot = this.props.bot;
    this.state = {
      bfd: {},
    }
  }

  async componentDidMount() {
    let data = await Axios.get(util.format(BFD_URL, this.bot.id)).then(res => {
      if (res.status !== 200) {
        return { ok: false, data: null}
      }
      return { ok: true, data: res.data }
    })

    if (data.ok) {
      this.setState({
        bfd: data.data,
      })
    }
  }

  render() {
    if (!this.state.bfd || Object.keys(this.state.bfd).length === 0) {
      return null
    }

    return (
      <div className="">
        <p>Bot meta information (provided by <a href="https://botsfordiscord.com">botsfordiscord.com</a>):</p>
        <br />
        <p>
          <BotMetaItem name="server count" value={this.state.bfd.count} />
          <BotMetaItem name="prefix" value={this.state.bfd.prefix} />
          <BotMetaItem name="id" value={this.state.bfd.id} />  
          <BotMetaItem name="owner id" value={this.state.bfd.owner} />  
        </p>
        <br />
      </div>
    )
  }
}

const BotMetaItem = (props) => (
  <div className="tags has-addons" style={{ display: "inline", marginRight: "1em" }}>
    <span className="tag is-dark">{props.name}</span>
    <span className="tag">{props.value}</span>
  </div>
)

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
              <BotMeta bot={bot} />
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
