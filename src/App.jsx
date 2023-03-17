import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

function App() {
  const [notes, setNotes] = useState([
    {
        "id": 1,
        "title": "Demo Note",
        "body": "Text",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": 2,
        "title": "Demo Note 2",
        "body": "Texty text",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": 3,
        "title": "Demo Note 3",
        "body": "Texty text text",
        "created_at": 1678968420,
        "updated_at": 1678968420
    },
    {
        "id": 4,
        "title": null,
        "body": null,
        "created_at": null,
        "updated_at": null
    },
    {
        "id": 5,
        "title": null,
        "body": null,
        "created_at": null,
        "updated_at": null
    }
]);

  const [activeNote, setActiveNote] = useState(false);
  
  const makeApiCall = async ()=>{
    try{
      let res = await fetch('http://localhost:8080/notes?sort=-id');
      let data = await res.json();
      setNotes(data);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    makeApiCall();
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const onAddNote = () => {
    const newNote = {
      id: notes.length + 1,
      title: "Untitled Note",
      body: "",
      craeted_at: Date.now(),
      updated_at: null
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const onDeleteNote = async (noteId) => {
    setNotes(notes.filter(({ id }) => id !== noteId));

    // delete in backend
    let res = await fetch(`http://localhost:8080/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });

    console.log(res);
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }

      return note;
    });

    setNotes(updatedNotesArr);
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;
