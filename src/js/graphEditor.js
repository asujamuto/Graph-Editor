import { scale, add, substract, distance, getNearestPoint } from "./math/utils.js";
import Point from "./primitives/point";
import Segment from "./primitives/segment";

export default class GraphEditor {

    constructor(viewport, graph)
    {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph

        this.ctx = this.canvas.getContext("2d")
        this.selected = null; 
        this.hovered = null

        this.#addEventListeners()
    }    

    #select(point){
        if(this.selected)
        {
            this.graph.tryAddSegment(new Segment(this.selected, point))
        }
        this.selected = point;
    }
    #removePoint(point){
        this.graph.removePoint(point)
        this.hovered = null
        if(this.selected == point)
        {
            this.selected = null
        }
        this.selected = null
    }
    
    #addEventListeners()
    {
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this))
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this))
    }
    

    #handleMouseMove(evt) 
    {
      this.mouse = this.viewport.getMouse(evt, true)
            this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom*2)
            if(this.dragging == true)
            {
                this.selected.x = this.mouse.x
                this.selected.y = this.mouse.y
            }
            this.canvas.addEventListener("contextmenu", evt => evt.preventDefault())
            this.canvas.addEventListener("mouseup", () => this.dragging = false)
    }

    #handleMouseDown(evt)
    {
        if(evt.button == 2)
            {
                if(this.selected)
                {
                    this.selected = null
                }   
                
                else if( this.hovered) 
                {
                   this.#removePoint(this.hovered);
                }
            }
            //left click
            if(evt.button == 0)
            {
                if(this.hovered)
                {
                    this.#select(this.hovered)
                    this.dragging = true
                    return
                }
                this.graph.addPoint(this.mouse)
                this.#select(this.mouse)
                this.hovered = this.mouse;
            }
            this.canvas.addEventListener("contextmenu", evt => evt.preventDefault())
    }
    
    dispose()
    {
        this.graph.dispose();
        this.selected = null
        this.hovered = null
    }
    display()
    {
        this.graph.draw(this.ctx)
        if(this.hovered){
            this.hovered.draw(this.ctx, { fill: true })
        }
        if(this.selected){
            const intent = this.hovered ? this.hovered : this.mouse
            new Segment(this.selected, intent).draw(this.ctx, {dash: [3,3]});
            this.selected.draw(this.ctx, { outline: true })
        }
    }
}