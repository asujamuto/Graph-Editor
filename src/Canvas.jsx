import { useEffect, useState } from 'react'
import './App.css'
import { useRef } from 'react'
import Graph from './js/math/graph.js'
import Viewport from './js/viewport.js'
import GraphEditor from './js/graphEditor.js'

import Point from './js/primitives/point.js';
import Segment from './js/primitives/point.js';

const Canvas = (props) => {

  const ref = useRef()
  
  const [globalGraphEditor, setGlobalGraphEditor] = useState();
  const [globalGraph, setGlobalGraph] = useState(0);
  
  useEffect(() => {
    const myCanvas = ref.current;
    myCanvas.width = 600;
    myCanvas.height = 900; 
    const ctx = myCanvas.getContext('2d') 
    const graphString = localStorage.getItem("graph");
    const graphInfo = graphString ? JSON.parse(graphString) : null;
    const graph = graphInfo ? Graph.load(graphInfo) : new Graph();
    const viewport = new Viewport(myCanvas);
    const graphEditor = new GraphEditor(viewport, graph);

    animate()
    function animate()
    {
      viewport.reset();
      graphEditor.display();
      requestAnimationFrame(animate);
    }
       
    
    setGlobalGraphEditor(graphEditor) 
    setGlobalGraph(graph)
  },[])
  
  const saveFile = async (blob) => {
    const a = document.createElement('a');
    a.download = 'graph.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  } 
  function saveToLocalStorage()
  {
    localStorage.setItem("graph", JSON.stringify(globalGraph))
  } 

  function saveOnComputer()
  {
    const blob = new Blob([JSON.stringify(globalGraph, null, 2)], {type : 'application/json'});
    saveFile(blob);
  }
  
  function importFile()
  {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
       // getting a hold of the file reference
       var file = e.target.files[0]; 
    
       // setting up the reader
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');
    
       // here we tell the reader what to do when it's done reading...
       reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!
          console.log(JSON.stringify(JSON.parse(content)))
          localStorage.setItem("graph", JSON.stringify(JSON.parse(content)))
          location.reload();
       }

    }
    input.click();
    
  }
  
  return (
    <>
      <h1>
        GraphEditor 
      </h1>
      <div id="controls">
          <button style={{ borderRadius: 20 }} onClick={() => globalGraphEditor.dispose()}>
              <span>&#128465;</span>
              <p>delete all</p>
          </button>   
          <button style={{ borderRadius: 20 }} onClick={saveToLocalStorage}>
              <span>&#128450;</span>
              <p>save graph to Local Storage</p>
          </button>
          <button style={{ borderRadius: 20 }} onClick={saveOnComputer}>
              <span>&#128450;</span>
              <p>save graph locally</p>
          </button>
          <button style={{ borderRadius: 20 }} onClick={importFile}>
              <span>&#128450;</span>
              <p>import file</p>
          </button>
      </div>
      <canvas ref={ref} {...props} id="myCanvas"/>
     
    </>
  )
}

export default Canvas 
