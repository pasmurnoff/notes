const Main = ({ activeNote, onUpdateNote }) => {
  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };

  const addNote = async (data)=>{
    let res = await fetch("http://localhost:8080/notes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    let status = res.json();
    console.log(status);
  }

  const handleOnSubmit = (e)=>{
    e.preventDefault();
    let title = e.target[0].value;
    let body = e.target[1].value;
    let craeted_at = Date.now();
    let updated_at = "";

    addNote({title, body, craeted_at, updated_at});
  };

  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <form action="" onSubmit={(e)=> handleOnSubmit(e)}>
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
          <input type="submit" value="create note"/>
        </form>
      </div>
    </div>
  );
};

export default Main;
