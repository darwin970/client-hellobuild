import { useState, useEffect } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';

const GITHUB_CLIENT_ID = "c7d03538e3726b517300";
const gitHubRedirectURL = "http://localhost:3001/api/auth/github";
const path = "/";

function App() {

  const [user, setUser] = useState();
  const [repositories, setRepositories] = useState();

  useEffect(() => {
    (async function () {
      const usr = await axios
        .get(`http://localhost:3001/api/me`, {
          withCredentials: true,
        })
        .then((res) => res.data)
        .catch((error) => {
          console.log(error);
          axios.get(`http://localhost:3001/api/me`, {
            withCredentials: true,
          })
          .then((res) => console.log(res));
        });
        setUser(usr);
    })();

    axios.get(`http://localhost:3001/api/github/all-repositories`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setRepositories(res.data);
      });
  }, []);

  function logout() {
    axios.get(`http://localhost:3001/api/auth/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!user ? (
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${gitHubRedirectURL}?path=${path}&scope=user:email`}
          >
            LOGIN WITH GITHUB
          </a>
        ) : (
          <div>
            <h2>Welcome {user.login}</h2>
            <div>
              <table>
                <thead>
                <tr>
                  <th>Repositorio</th>
                  <th>Fecha Creacion</th>
                  <th>Visibilidad</th>
                  <th>Favorito</th>
                </tr>
                </thead>
                <tbody>
                  {repositories?.map((val, key) => {
                    return (
                      <tr key={val.id}>
                        <td>{val.name}</td>
                        <td>{val.created_at}</td>
                        <td>{val.visibility}</td>
                        <td>No <input type='checkbox'></input></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <button onClick={logout}>Salir</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
