import React from 'react';
import jQuery from 'jquery';
window.jQuery = jQuery;
const FeedItem = React.createClass({
  render() {
    return (
      <a href={this.props.link} target="_blank">
        <li className="feeditem">{this.props.title}</li>
      </a>
    );
  }
});
export default React.createClass({
  getInitialState() {
    return {
      feed: [],
      size: this.props.size || 5
    };
  },
  componentDidMount() {
    this.getFeed();
    this.interval = setInterval(this.getFeed, (this.props.delay * 1000));
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  getFeed() {
    let that = this;
    jQuery.ajax({
      url: this.props.feed,
      success: function (response) {
        let xml = jQuery(response);
        let feed = [];
        xml.find('item').each(function () {
          let item = {};
          item.title = jQuery(this).find('title').text();
          item.link = jQuery(this).find('guid').text();
          feed.push(item);
        });
        that.setState({
          feed: feed.slice(0,that.state.size)
        });
      }
    });
  },
  render() {
    let feedItems = this.state.feed.map(function (item, index) {
      return (
        <FeedItem title={item.title} link={item.link} key={item.link}></FeedItem>
      );
    });
    return (
      <div className="feedwidget widget">
        <div className="widget-content">
          <h2 ref="feed"> Fetched from {this.props.feed}</h2>
          <ul>
            {feedItems}
          </ul>
        </div>
      </div>
    );
  }
});
