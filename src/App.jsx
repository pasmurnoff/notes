import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

function App() {
  const [notes, setNotes] = useState([]);

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
      title: "Untitled Note",
      body: "",
      craeted_at: Date.now(),
      updated_at: null
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const updateNote = async (data)=>{
    const res = await fetch(`http://localhost:8080/notes/${activeNote}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    console.log(`http://localhost:8080/notes/${activeNote}`)
  }

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
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} updateNote={updateNote} makeApiCall={makeApiCall}/>
    </div>
  );
}

export default App;
