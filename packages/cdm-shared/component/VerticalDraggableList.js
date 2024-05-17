import React from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import map from 'lodash/map'
import move from '../utils/move'

// create portal in case we need it
// we need portals when one of the list's parent has some CSS transformations
// which totally fucks the mouse offset calculation during drag operation.
const portal = document.createElement('div');
portal.classList.add('draggable-target-portal');
if (!document.body) {
  throw new Error('body not ready for portal creation!');
}
document.body.appendChild(portal);

// get list style
const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : 'lightgrey'
})

// single item style
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    // background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle,
})

const Item = ({
    item,
    index,
    provided,
    snapshot,
    usePortal,
    // functions
    getItem
}) => {

    const child = (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
            )}
            >
    
            {getItem(item, index)}
                
        </div>
    )

    if (usePortal && snapshot.isDragging) return ReactDOM.createPortal(child, portal)
    
    return child

}

class InnerList extends React.Component {

    shouldComponentUpdate(nextProps) {
      if (this.props.items === nextProps.items) return false
      return true
    }

    render() {
        const { items, name, usePortal } = this.props

        const { getItem } = this.props

        return map(items, (item, index) => (
            <Draggable 
                key={`${name}-${index}`} 
                draggableId={`${name}-${index}`} 
                index={index}
                >

                {(provided, snapshot) => (

                    <Item
                        item={item}
                        index={index}
                        provided={provided}
                        snapshot={snapshot}
                        getItem={getItem}
                        usePortal={usePortal}
                        />
                )}

            </Draggable>
        ))
    }
  }

const VerticalDraggableList = ({
    items,
    name,
    usePortal,
    // functions
    getItem,
    onDragEnd
}) => (
    <DragDropContext onDragEnd={result => {
            // dropped outside the list
            if (!result.destination) return
            // no movement
            if (result.destination.index === result.source.index) return
            onDragEnd(move(items, result.source.index, result.destination.index))
        }}
        >
        <Droppable droppableId={name || "droppable-channel"}>
            {(provided, snapshot) => (
                <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                >
                
                    <InnerList
                        name={name}
                        items={items}
                        usePortal={usePortal === true || false}
                        getItem={getItem}
                        />

                </div>
            )}
        </Droppable>
    </DragDropContext>
)

export default VerticalDraggableList
