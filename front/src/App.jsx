import { useState,useEffect } from 'react'
import axios from "axios"
import { Notes as NotesComponent } from './components/notes'
import {objAlert2,objAlert2Mixin} from "./components/sweetAlert"

let vr_input_title = "";
let vr_input_text = "";
const month = ["January","February","March","April","June","July","August","September","October","November","December"];


function App() {
  
  //variables
  const vrENV = import.meta.env.VITE_CONNECTION_BD;
  const [values,setValues] = useState({title: "", text: ""});
  const [valuesBD,setValuesBD] = useState([]);
  const [posID,setPosID] = useState(0);
  //variables of setting
  const [stateNote,setStateNote] = useState(false);
  const [refresh,setRefresh] = useState("");
  const [modeEditing,setModeEditing] = useState(false);
  const [vrSearch,setSearch] = useState("");
  const formData = new FormData();
  const objDate = new Date();
  const noteDate = {day:0,month:0,year:0};

  useEffect(()=>{
    axios({method:"get", url: `${vrENV}/showNoteBD`})
    .then(res=>{
      setValuesBD(res.data.Data);
      setRefresh(false);
    })
    .catch(err=>{return console.log(err)});
  }, [refresh]);

  console.log(`${vrENV}`);

  const emptyFields = ()=>{
    document.getElementById("input_title").value = "";
    document.getElementById("input_text").value = "";
    document.getElementById("content_activity_writing").classList.remove("--active");
    document.getElementById("modalClose").style.setProperty("transform","scale(1)");
    vr_input_title = "";
    vr_input_text = "";
    values.title ="";
    values.text = "";
  }

  const Notes = (e)=>{
    if(e.target.id === "input_title"){
      vr_input_title = e.target.value;
      setValues({...values, title : vr_input_title });
    }else if(e.target.id === "input_text"){
      vr_input_text = e.target.value;
      setValues({...values,text: vr_input_text });
    }

    if(
      (vr_input_title.length === 0 || vr_input_title[0] === " ") || (vr_input_text.length === 0 || vr_input_text[0] === " ")
    ){
      document.getElementById("content_activity_writing").classList.remove("--active");
      document.getElementById("modalClose").style.setProperty("transform","scale(1)");
    }else{
      document.getElementById("content_activity_writing").classList.add("--active");
      document.getElementById("modalClose").style.setProperty("transform","scale(0)");
    }
  }

  const CloseNote = (e)=>{
    document.getElementById("input_title").value = "";
    document.getElementById("input_text").value = "";
    document.getElementById("content_activity_writing").classList.remove("--active");
    vr_input_title = "";
    vr_input_text = "";
    values.title ="";
    values.text = "";
  }

  const CloseEditing = (e)=>{
    objAlert2.fire({
      icon:"question",
      title: <span className="text-primary">{(stateNote === "newNote")? "Are you sure you don't save this note?" : "Are you sure not to save the changes?"}</span>,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText:"No",
      showLoaderOnConfirm: true,
      preConfirm:()=>{console.log("undefined")},
      willOpen:()=>{
        const confirmBtn = objAlert2.getConfirmButton();
        confirmBtn.setAttribute('data-bs-toggle', 'modal');  
      }
    }).then((res=>{
      if(res.isConfirmed){
        emptyFields();
      }
    }));
  }
  
  const systemSave = (e)=>{
    e.preventDefault();
    if(stateNote === "newNote"){
      noteDate.day = objDate.getDate();
      noteDate.month = month[objDate.getMonth()];
      noteDate.year = objDate.getFullYear();
      formData.append("noteTitle",values.title);
      formData.append("noteText",values.text);
      formData.append("noteDate",`${noteDate.month},${noteDate.day} ${noteDate.year}`);
      
      axios({
        method: "post",
        url: `${vrENV}/save`,
        data: formData,
        headers: { 
          "Content-Type": "application/json",
        },
      })
      .then(res=>{
        if(res.data.Status === "new notes"){
          objAlert2Mixin.fire({icon: "success", title:<span className="text-success">New note</span>});
          emptyFields();
          setRefresh(true);
        }
      })
      .catch(err=>{return console.log(err)});
    }else if(stateNote === "modifyNote"){
      noteDate.day = objDate.getDate();
      noteDate.month = month[objDate.getMonth()];
      noteDate.year = objDate.getFullYear();

      formData.append("noteTitle",values.title);
      formData.append("noteText",values.text);
      formData.append("noteDate",`${noteDate.month},${noteDate.day} ${noteDate.year}`);
      formData.append("id",posID);
      
      axios({
        method: "post",
        url: `${vrENV}/modifyBD`,
        data: formData,
        headers: { 
          "Content-Type": "application/json",
        },
      })
      .then(res=>{
        if(res.data.Status === "modify notes"){
          objAlert2Mixin.fire({icon: "success", title:<span className="text-success">Modify note</span>});
          emptyFields();
          setRefresh(true);
        }
      })
      .catch(err=>{return console.log(err)});
    }
  }

  const noteTrash = (e)=>{
    objAlert2Mixin.fire({icon:"success", title: <span className="text-success">Delete successfully</span>});
    setSearch("");
    emptyFields();
    setRefresh(e);
  }

  //search
  const filterNotesBD = !vrSearch ? valuesBD : valuesBD.filter((item)=> item.vr_title.toLowerCase().includes(vrSearch.toLocaleLowerCase()));

  return (
    <>
      <header className="d-flex align-item-center justify-content-around p-3">
        <div className="base">
          <h3>Notes</h3>
          <button className="btnAddNote rounded" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={(e)=>{setStateNote("newNote")}}>
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
        <div className="base">
          <nav>
            <div className="content_search rounded-pill p-2">
              <input className="mx-2" type="text" placeholder="Search note" onChange={(e)=>{setSearch(e.target.value)}} value={vrSearch}/>
              <span className="mx-2">
                <i className="bi bi-search"></i>
              </span>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="container p-2">
          <div className="d-flex align-items-center justify-content-start flex-wrap mt-2 px-2">
            
            {(filterNotesBD.length <= 0)?
              "notes not exit..." :
              filterNotesBD.map((itemBD,index)=>
                (
                  <NotesComponent
                    key={index}
                    Title={itemBD.vr_title}
                    Text={itemBD.vr_text}
                    vrDate={itemBD.vr_fecha}
                    vrID={itemBD.id}
                    funcMessage={(message,st)=>{setPosID(message);setModeEditing(true);setStateNote(st)}}
                    vrDelete={noteTrash}
                  />
                )
              )
            }

             
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                  {
                    (stateNote === "modifyNote" && modeEditing)?
                      valuesBD.map(itemBD=>{
                        if(itemBD.id === posID){
                          setModeEditing(false);
                          document.getElementById("input_title").value = itemBD.vr_title;
                          document.getElementById("input_text").value = itemBD.vr_text;
                          vr_input_title = itemBD.vr_title;
                          vr_input_text = itemBD.vr_text;
                          values.title = itemBD.vr_title;
                          values.text = itemBD.vr_text;
                          document.getElementById("topInfo_textarea").innerText = `${itemBD.vr_fecha}`;
                        }
                      })
                    : ""
                  }

                  <div className="modal-header px-4" id="contentModalMain">
                    <input className="modal-title" name="note_title" id="input_title" type="text" placeholder="Title" maxLength={38} onChange={Notes}/>
                    <button type="button" className="btn-close" id="modalClose" data-bs-dismiss="modal" aria-label="Close" onClick={CloseNote}>
                      <i className="bi bi-x"></i>
                    </button>
                    <div className="iconActivityWriting" id="content_activity_writing">
                      <button type="button" id="closeEditing" onClick={CloseEditing}>
                        <i className="bi bi-x"></i>
                      </button>
                      <button type="submit" id="saveNote" data-bs-dismiss="modal" onClick={systemSave}>
                        <i className="bi bi-check2"></i>
                      </button>
                    </div>
                  </div>
                  <div className="modal-body d-flex flex-column px-4">
                    <span className="topInfo" id="topInfo_textarea">april, 23rd 2024</span>
                    <textarea className="mt-2"id="input_text" name="note_text" cols="30" rows="10" placeholder="writing..." onChange={Notes}></textarea>
                  </div>

                </div>
              </div>
            </div>
            
            
            

          </div>
        </div>
      </main>

      <footer></footer>
    </>
  )
}

export default App
