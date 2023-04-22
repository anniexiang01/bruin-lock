import "./App.css";
import Login from "./Login";
import { auth, db } from "./firebase";
import { uid } from "uid";
import { getDatabase, set, ref, onValue, remove, update } from "firebase/database";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";

function App() {
  const [isAuth, setIsAuth] = useState(false); // holds if user is logged in
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUuid, setTempUuid] = useState("");

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear()
      setIsAuth(false);
    });
  };

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  //read
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      setTodos([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((todo) => {
          setTodos((oldArray) => [...oldArray, todo]);
        });
      }
    });
  }, []);

  //write
  const writeToDatabase = () => {
    const uuid = uid();
    set(ref(db, `/${uuid}`), {
      todo,
      uuid,
    });

    setTodo("");
  };

  //set status
  const [status, setStatus] = useState(0);
  const database = getDatabase();
  const statusRef = ref(database, 'status');

  useEffect(() => {
    onValue(statusRef, (snapshot) => {
      const value = snapshot.val();
      setStatus(value);
    });
  }, [statusRef]);
  
  const handleButtonClick = () => {
    const newStatus = status === 0 ? 1 : 0;
    set(statusRef, newStatus);
  };

  let buttonText;
  if (status === 0) {
    buttonText = 'Click to set status to 1';
  } else if (status === 1) {
    buttonText = 'Click to set status to 0';
  } else {
    buttonText = 'Invalid status';
  }

  //update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTempUuid(todo.uuid);
    setTodo(todo.todo);
  };

  const handleSubmitChange = () => {
    update(ref(db, `/${tempUuid}`), {
      todo,
      uuid: tempUuid,
    });

    setTodo("");
    setIsEdit(false);
  };

  //delete
  const handleDelete = (todo) => {
    remove(ref(db, `/${todo.uuid}`));
  };

  return (
    <>
      {isAuth ? (
        <div className="App">
          <div>
            <button onClick={signUserOut}>Sign Out</button>
          </div>
          <div>
            Welcome back, {auth.currentUser.displayName}!
          </div>
          <input type="text" value={todo} onChange={handleTodoChange} />
          {isEdit ? (
            <>
              <button onClick={handleSubmitChange}>Submit Change</button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setTodo("");
                }}
              >
                X
              </button>
            </>
          ) : (
            <button onClick={writeToDatabase}>submit</button>
          )}
          <div>
            <p>Current status is: {status}</p>
            <button onClick={handleButtonClick}>{buttonText}</button>
          </div>
          {todos.map((todo) => (
            <>
              <h1>{todo.todo}</h1>
              <button onClick={() => handleUpdate(todo)}>update</button>
              <button onClick={() => handleDelete(todo)}>delete</button>
            </>
          ))}
        </div>
      ) : (
        <Login setIsAuth={setIsAuth} />
      )}
    </>
  );
}
  
export default App;
  

// npm install firebase
// npm install uid