import './App.scss';
import nba from './nba.png';
import nbaImage from './nba2.jpeg';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';

function MainComponent() {

  return (<div id={"main-div"}>
    <div id={"first-item"}></div>
    <Container id={"second-item"}>
      <Router>
        <div>
          <LinkContainer to="/">
            <Button className={"btn btn-dark btn-space btn-lg"}>Home</Button>
          </LinkContainer>
          <LinkContainer to="/search">
            <Button className={"btn btn-light btn-space btn-lg"}>Search</Button>
          </LinkContainer>
          <LinkContainer to="/register">
            <Button className={"btn btn-primary btn-space btn-lg"}>Register</Button>
          </LinkContainer>
          <LinkContainer to="/login">
            <Button className={"btn btn-success btn-space btn-lg"}>Login</Button>
          </LinkContainer>
        </div>
        <div style={{ width: "100%" }}></div>
        <div>
          <Routes >
            <Route path={"/"} element={<Home />} />
            <Route path={"/search"} element={<Search />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/login"} element={<LoginForm />} />
            <Route path={"*"} element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>
    </Container>
  </div>)
}

function Home() {
  return <div>
    <h1 className={"home-h1"}>Welcome To NBA Advanced Statistics</h1>
    <br />
    <div>
      <img src={nba} style={{ float: "right", marginRight: "20px" }} alt="NBA Statistics" />
      <p className={"home-p"}>NBA Statistics is an official
        site hosted by National Basketball Association. This is where you will find the
        most recent and accurate results from either your favourite teams or players.
        Our website also has functionalities that help you compare and gain a better
        understanding of what is actually going on through out the season.</p>
    </div>
    <br />
    <h1 className={"home-h1"}>Essential Features</h1>
    <br />
    <div>
      <img src={nbaImage} width="35%" style={{ float: "right", marginRight: "20px" }} alt="Basketball" />
      <ul className={"home-p"}>
        <li><a href="https://www.nba.com/stats/players/advanced-leaders/">Advanced Player Leaders</a></li>
        <li><a href="https://www.nba.com/stats/teams/advanced-leaders/">Advanced Team Leaders</a></li>
        <li><a href="https://www.nba.com/stats/alltime/">All-Time Leaders</a></li>
        <li><a href="https://www.nba.com/stats/players/shooting-efficiency/">Player Tracking</a></li>
        <li><a href="https://www.nba.com/stats/help/glossary/">Glossary</a></li>
        <li><a href="https://www.nba.com/stats/help/faq/">FAQ</a></li>
      </ul>
    </div>
  </div>
}

function Search() {
  const [obj, setObj] = useState({});
  const [search, setSearch] = useState("players");
  const [vip, setVip] = useState(true);
  const [visible, setVisible] = useState({ players: false, teams: false, games: false });
  const [specific, setSpecific] = useState("");
  const [box, setBox] = useState(true)
  const url = 'https://free-nba.p.rapidapi.com/' + search + '?page=0&per_page=25';

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'free-nba.p.rapidapi.com',
      'X-RapidAPI-Key': 'b6426b86d3mshe2142e801d0979fp179dd9jsn27f95008b513'
    }
  };

  useEffect(() => {
    fetch(url, options)
      .then(res => res.json())
      .then(json => setObj(json))
      .catch(err => console.error('error:' + err));
  }, [url])

  const searchCondition = () => {
    if (search === "players") {
      setVisible({ players: true })
      setBox(false);
      return;
    } if (search === "teams") {
      setVisible({ teams: true });
      setBox(false);
      return;
    } else {
      setVisible({ games: true });
      setBox(false);
      return;
    }
  }

  return <div>
    <h1 className={"home-h1"}>Searching Engine</h1><br />
    <p className={"home-p"}>Please choose one of the options below.</p><br />
    <select style={{ fontSize: "18px" }} name="search" id="search" onChange={(event) => {
      setSearch(event.target.value);
      setVisible({ [event.target.value]: false });
      setBox(true);
    }}>
      <option className={"home-p"} value="players">Players</option>
      <option className={"home-p"} value="teams">Teams</option>
      <option className={"home-p"} value="games">Games</option>
    </select><br /><br />
    <p className={"home-p"}>Enter player's first name or last name to search</p>
    <input onChange={(event) => setSpecific(event.target.value)} type="text" name="condition" id="condition" disabled={vip} />
    <input style={{ marginLeft: "20px", fontSize: "20px" }} type="checkbox"
      onChange={() => setVip(!vip)} /><span className={"radio-btn"}> Are you a VIP?</span><br /><br /><br />
    <Button type="button" className={"btn btn-success btn-lg"} onClick={searchCondition}>View All</Button>
    <br /><br />
    {box ? <div className={"board"} style={{ height: "50vh", fontSize: "25px" }}>Results will be shown here.</div> : <div></div>}
    {visible.players ? obj.data && <Players players={obj.data} condition={specific} /> : <div></div>}
    {visible.teams ? obj.data && <Teams teams={obj.data} /> : <div></div>}
    {visible.games ? obj.data && <Games games={obj.data} /> : <div></div>}
  </div>
}

const Players = ({ players, condition }) => {
  if (condition === "") {
    return <div className={"board"}>
      {players.map((item) => {
        return <div key={item.id}>
          <p>ID: {item.id}</p>
          <p>First Name: {item.first_name}</p>
          <p>Last Name: {item.last_name}</p>
          <p>Team: {item.team.full_name}</p>
          <hr />
        </div>
      })}
    </div>
  }
  else {
    const specificPlayer = players.filter((element) =>
      element.first_name === condition || element.last_name === condition);
    if (specificPlayer.length === 0) {
      return <div className={"board"}>
        No Player Found
      </div>
    }
    return <div className={"board"}>
      <h4>Player <span className={"player"}>{specificPlayer[0].first_name} {specificPlayer[0].last_name}</span> with an ID of <span className={"player"}>{specificPlayer[0].id}</span></h4>
      <h4>He is playing for <span className={"player"}>{specificPlayer[0].team.full_name}</span></h4>
    </div>
  }

}

const Teams = ({ teams }) => {
  return <div className={"board"}>
    {teams.map((item) => {
      return <div key={item.id}>
        <p>ID: {item.id}</p>
        <p>City: {item.city}</p>
        <p>Team: {item.full_name}</p>
        <hr />
      </div>
    })}
  </div>
}

const Games = ({ games }) => {
  return <div className={"board"}>
    {games.map((item) => {
      return <div key={item.id}>
        <p>ID: {item.id}</p>
        <p>Date: {item.date}</p>
        <p>Home Team: {item.home_team.full_name}</p>
        <p>Visitor: {item.visitor_team.full_name}</p>
        <hr />
      </div>
    })}
  </div>
}

function Register() {

  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [repassword, setRepassword] = useState("");
  const [fnameErr, setFnameErr] = useState("");
  const [lnameErr, setLnameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [repasswordErr, setRepasswordErr] = useState("");
  const [valid, setValid] = useState(false);
  const [radio, setRadio] = useState(false);

  const handleChange = (event) => {
    if (event.target.id === "fname") {
      setFname(event.target.value);
    } else if (event.target.id === "lname") {
      setLname(event.target.value);
    }else if (event.target.id === "email") {
      setEmail(event.target.value);
    }else if (event.target.id === "usern") {
      setUserName(event.target.value);
    }else if (event.target.id === "pwd") {
      setPass(event.target.value);
    }
    else if (event.target.id === "rulesok") {
      setRadio(true);
    }
    else if (event.target.id === "rulesbreak") {
      setRadio(false);
    }else {
      setRepassword(event.target.value);
    }
  }

  const validate = () => {
    let fnameErr = "";
    let lnameErr = "";
    let repasswordErr = "";
    let emailErr = "";
    let usernameErr = "";
    let passErr = "";
    if (!fname) {
      fnameErr = "First Name cannot be empty";
    }
    if (fnameErr) {
      setFnameErr(fnameErr);
      return false;
    }
    if (!lname) {
      lnameErr = "Last Name cannot be empty";
    }
    if (lnameErr) {
      setLnameErr(lnameErr);
      return false;
    }
    if (!email.includes("@")) {
      emailErr = "Invalid Email";
    }
    if (email.includes("@")) {
      setEmailErr("");
    }
    if (emailErr) {
      setEmailErr(emailErr);
      return false;
    } 
    if (!username) {
      usernameErr = "Username cannot be empty";
    }
    if (usernameErr) {
      setUsernameErr(usernameErr);
      return false;
    }
    if (!pass) {
      passErr = "Password cannot be empty";
    }
    if (passErr) {
      setPassErr(passErr);
      return false;
    }
    if (repassword != pass) {
      repasswordErr = "Password must be matched";
    }
    if (repassword === pass) {
      setRepasswordErr("");
    }
    if (repasswordErr) {
      setRepasswordErr(repasswordErr);
      return false;
    }
    if (!radio) {
      return false;
    }
    else {
      return true;
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const validInfo = validate();
    if (validInfo) {
      setValid(true)
    }

  }
  return <form style={{ marginLeft: "5px" }} onSubmit={() => { navigate("/confirmation") }}>

    <h1 className={"home-h1"}> Registration Form </h1>

    <h2 className={"home-h1"}> Personal Information </h2>

    <input type="text" id="fname" name="pinfo" placeholder="First Name" onChange={handleChange} />{!fname ? <span style={{ color: "red", fontSize: "20px" }}>{fnameErr}</span> : null}
    <br></br>

    <input type="text" id="lname" name="pinfo" placeholder="Last Name" onChange={handleChange} />{!lname ? <span style={{ color: "red", fontSize: "20px" }}>{lnameErr}</span> : null}
    <br></br>

    <h3 className={"home-h1"}> Address </h3>

    <input type="text" id="stradd" name="address" placeholder="Street Address" /><span style={{ color: "red", fontSize: "20px" }}>*option</span>
    <br></br>

    <input type="text" id="city" name="address" placeholder="City" /><span style={{ color: "red", fontSize: "20px" }}>*option</span>
    <br></br>

    <input type="text" id="provstate" name="address" placeholder="Province or State" /><span style={{ color: "red", fontSize: "20px" }}>*option</span>
    <br></br>

    <input type="text" id="zippost" name="address" placeholder="Zip or Postal Code" /><span style={{ color: "red", fontSize: "20px" }}>*option</span>
    <br></br>

    <h3 className={"home-h1"}> Contact Information </h3>

    <input type="digit" id="homephone" name="cinfo" placeholder="Home Phone" /><span style={{ color: "red", fontSize: "20px" }}>*option</span>
    <br></br>

    <input type="digit" id="cellphone" name="cinfo" placeholder="Cell Phone" /><span style={{ color: "red", fontSize: "20px" }}>*option</span>
    <br></br>

    <input type="text" id="email" name="cinfo" placeholder="Email" onChange={handleChange} />{emailErr ? <span style={{ color: "red", fontSize: "20px" }}>{emailErr}</span> : null}
    <br></br>

    <h2 className={"home-h1"}> Account Creation </h2>

    <input type="text" id="usern" name="register" placeholder="Username" onChange={handleChange} />{!username ? <span style={{ color: "red", fontSize: "20px" }}>{usernameErr}</span> : null}
    <br></br>

    <input type="password" id="pwd" name="register" placeholder="Password" onChange={handleChange} />{!pass ? <span style={{ color: "red", fontSize: "20px" }}>{passErr}</span> : null}
    <br></br>

    <input type="password" id="pwdconf" name="register" placeholder="Confirm Password" onChange={handleChange} />{repasswordErr ? <span style={{ color: "red", fontSize: "20px" }}>{repasswordErr}</span> : null}
    <br></br>

    <p className={"home-p"}> I have read the Terms and Conditions. </p>

    <input type="radio" id="rulesok" name="register" onChange={handleChange} /><span className={"radio-btn"}>Yes</span>
    <br></br>

    <input type="radio" id="rulesbreak" name="register" onChange={handleChange}/><span className={"radio-btn"}>No</span>
    <br></br>

    <p className={"home-p"}> After completing this form, please click on the "Submit" button. You will receive a confirmation email.
      If you do not receive the email within a few minutes, contact NBASTATS@NBA.com. </p>

    <input onClick={handleSubmit} className={"btn-register"} type="submit" value="Submit" />
    {valid ? <span className='home-p'> Success! you have registered a new account!</span> : null}

  </form>

}




function LoginForm() {
  const [userEmail, setUserValues] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  const handleUserEmail = (event) => {
    setUserValues({ ...userEmail, userEmail: event.target.value })
  }
  const handlePassowrd = (event) => {
    setPassword({ ...password, password: event.target.value })
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (userEmail && password) {
      setValid(true);
      navigate("/");
    }
    setSubmitted(true);

  }
  return (

    <div className='container'>
      <div align="center">
        <h1 align="center">Login Form</h1><br></br>

        <form id="login" onSubmit={handleSubmit}>

          <label><b>Enter Username:</b></label><br></br>
          <input type="text" name="uname" id="uname"
            placeholder="Username or Email" onChange={handleUserEmail} /> <br></br>
          {submitted && !userEmail ? <span style={{ color: 'red' }}>Please enter Email</span> : null}<br></br><br></br>

          <label><b>Enter Passoword: </b></label><br></br>
          <input type="password" name="Pass" id="Pass" placeholder='Password' onChange={handlePassowrd} /><br></br>
          {submitted && !password ? <span style={{ color: 'red' }}>Please enter Password</span> : null}<br></br>
          <h6>Click the checkbox to Remember me!</h6>
          <input type="checkbox" id="Check" /> <br></br>  <br></br>
          <Button type="button" onClick={handleSubmit} id="log" name="log" class="btn btn-primary btn-lg">Log in Here</Button><br></br><br></br>
          <br></br>
          Forgot your <a href="#">Password </a>?<br></br>
        </form>
      </div>
    </div>
  );
}

function PageNotFound() {
  return <h2>Sorry! The Page Is Not Found</h2>
}


// function Login() {

//   const [userName, setUserName] = useState("");
//   const [password, setPassword] = useState("");

//   const addUserName = (event) => {
//     setUserName(event.target.value)
//   }
//   const addPassword = (event) => {
//     setPassword(event.target.value)
//     //VALIDATE PASSOWRD WILL GO HERE

//   }
//   const SubmitForm = () => {
//     //VALIDATE SUBMISSION WILL GO HERE

//   }
//   return (
//     <div style={{ padding: '30px', border: '15px solid gray', background: 'lightgrey', width: '300px', margin: '60px' }}>
//       <h1 align="center">Login Form</h1>
//       <br></br>
//       <form align="center">
//         <h4>Please Enter your login and password Info!</h4>
//         <label>Enter your Username:<br></br></label>
//         <input type="text" placeholder='username'
//           value={userName}

//           onChange={addUserName} /><br></br><br></br>
//         <br></br> <label><br></br>Enter your Password:</label> <br></br>
//         <input
//           type="password" value={password} placeholder='password'

//           onChange={addPassword} />  <h5>Click the checkbox to Remember me!</h5>
//         <input type="checkbox" id="Check" />   <br></br>   <br></br>
//         <button

//           onClick={SubmitForm}> Login</button>
//       </form>


//     </div>
//   );
// }

export default MainComponent;
