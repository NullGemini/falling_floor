import React, { Component } from 'react';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { 
      showInfo: false,
			showAbout: false,
			showSource: false,
      time: {}, 
      seconds: 300,
      tileCount: 0,
      tileOrder: this.makeTileOrder(),
      tileDrop: this.makeTileDrop()
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.failedGuess = this.failedGuess.bind(this);
    this.countDown = this.countDown.bind(this);
    this.shuffleTiles = this.shuffleTiles.bind(this);

    this.openInfo = this.openInfo.bind(this);
    this.openAbout = this.openAbout.bind(this);
    this.openSource = this.openSource.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
    this.closeAbout = this.closeAbout.bind(this);
    this.closeSource = this.closeSource.bind(this);
  }

  makeTileOrder() {
    let newTileOrder = [];
    for (let x = 0; x < 24; x++) {
      newTileOrder.push(x);
    }
    return newTileOrder;
  }

  makeTileDrop() {
    let newTileDrop = [];
    for (let x = 0; x < 24; x++) {
      newTileDrop.push(false);
    }
    return newTileDrop;
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  shuffleTiles(tiles) {
    for (let x = 0; x < tiles.length; x++) {
			const temptile = tiles[x];
			const newPos = Math.floor((Math.random() * 24)) ;

			tiles[x] = tiles[newPos];
			tiles[newPos] = temptile;
    }

    return tiles;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    if (this.state.seconds < 1) {
      this.setState({time: this.secondsToTime(300), seconds: 300});
    }
    if (this.timer === 0) {
      // Reset Tiel Drop
      let newTileDrop = this.state.tileDrop;
      for (let x = 0; x < 24; x++) {
        newTileDrop[x] = false;
      }

      // Shuffle Tile Order
      let newTileOrder = this.state.tileOrder;
      newTileOrder = this.shuffleTiles(newTileOrder);

      // Set new states
      this.setState({tileCount: 0, tileOrder: newTileOrder, tileDrop: newTileDrop});

      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if 10 second interval has passed and drop next tile
    if (this.state.seconds % 10 === 0 && this.state.seconds < 240) {
      let newTileDrop = this.state.tileDrop;
      let newTileCount = this.state.tileCount
      let selectedTile = this.state.tileOrder[newTileCount];

      newTileDrop[selectedTile] = true;
      newTileCount = newTileCount + 1;
      this.setState({tileDrop: newTileDrop, tileCount: newTileCount})
    }
    
    // Check if we're at zero.
    if (seconds === 0) { 
      clearInterval(this.timer);
      this.timer = 0;
    }
  }

  failedGuess() {
    if (this.state.seconds > 0 && this.timer !== 0) {
      //Advance the puzzle 1 minute & check Tiles
      let currentSeconds = this.state.seconds;
      let currentTileDrop = this.state.tileDrop;
      let currentTileCount = this.state.tileCount;

      for (let x = 0; x < 60; x++) {
        currentSeconds = currentSeconds - 1;
        if (currentSeconds % 10 === 0 && currentSeconds < 240) {
          let selectedTile = this.state.tileOrder[currentTileCount];
          
          currentTileDrop[selectedTile] = true;
          currentTileCount = currentTileCount + 1;
        }
        if (currentSeconds === 0) {
          clearInterval(this.timer);
          this.timer = 0;
          break;
        }
      }

      this.setState({seconds: currentSeconds, time: this.secondsToTime(currentSeconds), tileDrop: currentTileDrop, tileCount: currentTileCount})
    }
  }

  openInfo() {
    this.setState({showInfo: true});
  }

  openAbout() {
    this.setState({showAbout: true});
  }

  openSource() {
    this.setState({showSource: true});
  }

  closeInfo() {
    this.setState({showInfo: false});
  }

  closeAbout() {
    this.setState({showAbout: false});
  }

  closeSource() {
    this.setState({showSource: false});
  }

  render() {
    return (
      <div id="App">

        <div id="app-header">
					<div id="title">Falling Floor Puzzle</div>
					<ButtonGroup justified className="header_links">
							<Button bsClass="btn-outline-secondary" onClick={this.openInfo}>Info</Button>
							<Button bsClass="btn-outline-secondary" onClick={this.openAbout}>About</Button>
							<Button bsClass="btn-outline-secondary" onClick={this.openSource}>Source</Button>
					</ButtonGroup>
				</div>

        <div className="container">

          <div className="button_deck">
            <Button bsClass="btn-secondary" onClick={this.startTimer}>Start</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button bsClass="btn-primary" onClick={this.failedGuess}>Failed Guess</Button>
          </div>

          <div className="count_down_timer">
            {this.state.time.m}:{this.state.time.s<10?"0":""}{this.state.time.s}
          </div>

          <div>
            <table className="room_table">
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td className={this.state.tileDrop[0]?"tile drop":"tile"}>
                    1 
                  </td>
                  <td className={this.state.tileDrop[1]?"tile drop":"tile"}>
                    2
                  </td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td className={this.state.tileDrop[2]?"tile drop":"tile"}>
                    3
                  </td>
                  <td className={this.state.tileDrop[3]?"tile drop":"tile"}>
                    4
                  </td>
                  <td className={this.state.tileDrop[4]?"tile drop":"tile"}>
                    5
                  </td>
                  <td className={this.state.tileDrop[5]?"tile drop":"tile"}>
                    6
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td className={this.state.tileDrop[6]?"tile drop":"tile"}>
                    7
                  </td>
                  <td className={this.state.tileDrop[7]?"tile drop":"tile"}>
                    8
                  </td>
                  <td className={this.state.tileDrop[8]?"tile drop":"tile"}>
                    9
                  </td>
                  <td className={this.state.tileDrop[9]?"tile drop":"tile"}>
                    10
                  </td>
                  <td className={this.state.tileDrop[10]?"tile drop":"tile"}>
                    11
                  </td>
                  <td className={this.state.tileDrop[11]?"tile drop":"tile"}>
                    12
                  </td>
                </tr>
                <tr>
                  <td className={this.state.tileDrop[12]?"tile drop":"tile"}>
                    13
                  </td>
                  <td className={this.state.tileDrop[13]?"tile drop":"tile"}>
                    14
                  </td>
                  <td className={this.state.tileDrop[14]?"tile drop":"tile"}>
                    15
                  </td>
                  <td className={this.state.tileDrop[15]?"tile drop":"tile"}>
                    16
                  </td>
                  <td className={this.state.tileDrop[16]?"tile drop":"tile"}>
                    17
                  </td>
                  <td className={this.state.tileDrop[17]?"tile drop":"tile"}>
                    18
                  </td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td className={this.state.tileDrop[18]?"tile drop":"tile"}>
                    19
                  </td>
                  <td className={this.state.tileDrop[19]?"tile drop":"tile"}>
                    20
                  </td>
                  <td className={this.state.tileDrop[20]?"tile drop":"tile"}>
                    21
                  </td>
                  <td className={this.state.tileDrop[21]?"tile drop":"tile"}>
                    22
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td className={this.state.tileDrop[22]?"tile drop":"tile"}>
                    23
                  </td>
                  <td className={this.state.tileDrop[23]?"tile drop":"tile"}>
                    24
                  </td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="footer">
					Powered by React <img src={logo} className="react-logo" alt="logo" />
				</div>

        <Modal key="InfoModal" show={this.state.showInfo} onHide={this.closeInfo}>
					<Modal.Header>
						<Modal.Title>Info</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>How it Works</h4>
            <p>I developed this app for a D&amp;D campaign I was running.</p>
            <p>The puzzle works like this. Each character picks a square to stand on. The first minute none of the floor tiles will fall, but after that they will start to fall every 10 seconds. If the tile they're staninding on disapears, they can no longer help solve the puzzle.</p>
            <p>Additionally, if they guess wrong, the puzzle will advance one minute.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closeInfo}>Close</Button>
					</Modal.Footer>
				</Modal>

				<Modal key="AboutModal" show={this.state.showAbout} onHide={this.closeAbout}>
					<Modal.Header>
						<Modal.Title>About</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>NullGemini (Adam Mugnaini) is a web developer.</p>
						<p>The point of the app was to explore and build understanding of the ReactJS framework.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closeAbout}>Close</Button>
					</Modal.Footer>
				</Modal>

				<Modal key="SourceModal" show={this.state.showSource} onHide={this.closeSource}>
					<Modal.Header>
						<Modal.Title>Source</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>I'd love to hear feedback on tweaks, criticism, etc. The source code can be found on my github page.</p>
						<p><a href="https://github.com/NullGemini/timer_puzzle" target="_blank" rel="noopener noreferrer">https://github.com/NullGemini/timer_puzzle</a></p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closeSource}>Close</Button>
					</Modal.Footer>
				</Modal>

      </div>
    );
  }
}

export default App;
