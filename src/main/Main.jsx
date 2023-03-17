import { useEffect, useState } from "react";

const Main = ({ activeNote, onUpdateNote, updateNote, makeApiCall }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("");

  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };

  const addNote = async (data)=>{
    let res = await fetch("http://localhost:8080/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    if(res.status !== 500){
      setIsSaved(true)
      setMsg("note saved!")
   
      setTimeout(()=>{
        setMsg("")
      }, 3000)
    }
    else{
      setError("something went wrong note not saved")
    }
  }

  const handleOnClickUpdate = (e)=>{
    e.preventDefault();
    let title = activeNote.title;
    let body = activeNote.body;    
    updateNote({title, body});
    setMsg("note updated!")

    setTimeout(()=>{
      setMsg("")
    }, 3000)
  }

  const handleOnClickSave = (e)=>{
    e.preventDefault();
    let title = activeNote.title;
    let body = activeNote.body;    
    let craeted_at = Date.now(); 
    let updated_at = ""; 
    addNote({title, body, craeted_at, updated_at});
    makeApiCall();
  };


  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          placeholder="Note Title"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your note here..."
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
        />
        { !activeNote.id && <button onClick={handleOnClickSave}>save</button>}
        <br/>
        { activeNote.id && <button onClick={handleOnClickUpdate}>update</button>}
        <p>{error}</p>
        <p>{msg}</p>
      </div>
    </div>
  );
};

export default Main;
