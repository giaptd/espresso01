/*global firebase*/
import React, { Component } from 'react';
import * as BT from 'react-bootstrap';


const Info = (props)=>{

  return(
      <BT.Grid>
          <BT.Row>
              <BT.Col xs={6}>
                  <h2>Month: {props.currentMonth}</h2>
              </BT.Col>
              <BT.Col xs={6}>
                  <h2>Total: {props.sum}</h2>
              </BT.Col>
          </BT.Row>
      </BT.Grid>
      // {/*<BT.ListGroup>*/}
      //     {/*<BT.ListGroupItem>*/}
      //         {/*<div style={{float: 'left', width: '50%'}}>*/}
      //             {/*<h1><BT.Label>Month: {props.currentMonth}</BT.Label></h1>*/}
      //         {/*</div>*/}
      //         {/*<div style={{width: '25%'}}>*/}
      //             {/*<h1><BT.Label>Total: {props.sum}</BT.Label></h1>*/}
      //         {/*</div>*/}
      //     {/*</BT.ListGroupItem>*/}
      // {/*</BT.ListGroup>*/}
  );
}

class Form extends Component{
    state = {
        amount:0,
        desc:'',
    }
    currentMonth = new Date().getMonth()+1;
    submitForm = (event)=>{
        event.preventDefault();
        // call main App submit event handler
        this.props.handleAdd({text: this.state.desc, amount: this.state.amount, month:this.currentMonth});
        this.setState({desc:'', amount:''});
    }
    render(){
        return(
            <form type="submit" onSubmit={this.submitForm}>
              <BT.InputGroup>
                <BT.InputGroup.Addon>$</BT.InputGroup.Addon>
                <BT.FormControl type="text" value = {this.state.amount}

                onChange={(event)=>{this.setState({amount: event.target.value})}}
                placeholder="amount spent" />
                <BT.InputGroup.Addon>.000</BT.InputGroup.Addon>
              </BT.InputGroup>
              <div style={{marginTop:'5px'}} />
              <BT.InputGroup>
                <BT.FormControl type="text" value={this.state.desc}
                             onChange={(event)=>{this.setState({desc: event.target.value})}}
                             placeholder="content"/>
                <BT.InputGroup.Button>
                  <BT.Button type="submit">Add</BT.Button>
                </BT.InputGroup.Button>
              </BT.InputGroup>
            </form>
        );
    }
}

const EspressoList = (props)=>{
  if(props.items.length===0)
  {
      return(<h2>Nothing here for this month</h2>)
  }
  return(

      <BT.ListGroup style={{fontSize:'18px'}}>
          {props.items.map(item=>(

              <BT.ListGroupItem bsStyle="success">
                  {/*<div style={{width:'20%', float:'left'}} >*/}
                  {/*<BT.Glyphicon glyph="glass" bsSize="large"/>*/}
                  {/*</div>*/}
                  <div style={{width: '55%', float: 'left',}}>
                      {item.text}
                  </div>
                  <div style={{width: '20%', float: 'left', textAlign: 'center',}}>
                      {item.amount}
                  </div>
                  <div>
                      <BT.Button
                          onClick={props.deleteItem.bind(null, item['.key'])}
                          bsStyle="link">Delete</BT.Button>
                  </div>
              </BT.ListGroupItem>
          ))}
      </BT.ListGroup>
  );
}

class App extends Component {
  state = {
      items:[],
      sum:0
  }

  currentMonth = new Date().getMonth()+1;

  componentWillMount = ()=>{
      this.itemsRef = firebase.database().ref('espresso/items');
      this.itemsRef.limitToLast(25).on('value', function(snap){
          var snapItems =[];
          var total = 0;
          snap.forEach(function(childVal){
            var item = childVal.val();
            var thisMonth = new Date().getMonth()+1;
            if(parseInt(item.month)=== thisMonth){
                total = total + parseInt(item.amount);
                item['.key'] = childVal.key;
                snapItems.push(item);
            }
          });
          this.setState({items: snapItems, sum: total});
      }.bind(this));
  }

  handleAdd = (item)=>{
      this.itemsRef.push(item);
  }
    componentWillUnmount = ()=>{
        this.itemsRef.off();
    }
  deleteItem = (key)=>{
      this.itemsRef.child(key).remove();
  }
  render() {
    return (
      <div style={{margin:'10px'}}>
        <Info currentMonth={this.currentMonth} sum={this.state.sum}/>
        <Form currentMonth={this.currentMonth} handleAdd = {this.handleAdd}/>
        <div style={{marginBottom:'20px'}} />
        <EspressoList items = {this.state.items} deleteItem={this.deleteItem}/>
      </div>
    );
  }
}

export default App;
