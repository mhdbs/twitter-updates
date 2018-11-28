import React, {Component} from 'react'
import ReactDOM from 'react-dom';

class Main extends Component {
    constructor() {
        super();
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        setInterval(() => {
            if (!this.state.callSetInterval || this.state.fetching) {
                return
            }
            this.handleSearch()
        }, 10000)
    }
    async handleSearch() {
        var query = this.state.searchText;
        if (!query || query === '') {
            return
        }
        var url = window.location.href;
        url += query.indexOf('#') !== -1 ? 'h/' + query.replace('#', '') : 'u/' + query;
        console.log(url)
        if (!this.state.callSetInterval) {
            this.setState({
                fetching: true,
                callSetInterval: true 
            })
        } else {
            this.setState({
                fetching: true
            })
        }
        fetch(url).then(async (resp) => {
            var data = await resp.json();
            console.log(data)
            this.setState({ 
                data: data,
                fetching: false
            })
        })
    }
    render() {
        return (
            <div  style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{display:'flex', flexDirection: 'row'}}>
                    <input onChange={ev => this.setState({searchText: ev.target.value})} type="text" placeholder="Search"/>
                    <button onClick={this.handleSearch} disabled={this.state.fetching}>Load{this.state.fetching ? <span>ing..</span> : ''}</button>
                </div>
                <div style={{display:'flex', flexDirection: 'column',borderRadius: '5px', marginTop: '20px'}}>
                    {this.state.data.map((el, index) => {
                        return (
                            <div key={index} style={{background: 'lightgray', borderBottom: '1px solid white', padding: '10px'}}>
                                {el.text}
                                {/* <img src={el.name} alt="Smiley face" height="42" width="42"/> */}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Main/>, document.getElementById('app'));