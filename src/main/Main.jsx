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
      setMsg("Заметка сохранена!")
   
      setTimeout(()=>{
        setMsg("")
      }, 3000)
    }
    else{
      setError("Что-то пошло не так, заметка не сохранена!")
    }
  }

  const handleOnClickUpdate = (e)=>{
    e.preventDefault();
    let title = activeNote.title;
    let body = activeNote.body;    
    updateNote({title, body});
    setMsg("Запись обновлена!")

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


  if (!activeNote) return <div className="no-active-note">Нет активных заметок</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          placeholder="Заголовок заметки"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Начните писать текст здесь...."
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
        />
        { !activeNote.id && <button class="subutton" onClick={handleOnClickSave}>Создать заметку</button>}
        <br/>
        { activeNote.id && <button class="subutton" onClick={handleOnClickUpdate}>Обновить</button>}
        <p>{error}</p>
        <p>{msg}</p>
      </div>
    </div>
  );
};

export default Main;
