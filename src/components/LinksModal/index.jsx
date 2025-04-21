import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styles from './styles.module.scss';

const LinksModal = ({ linksData, setLinksData, closeModal }) => {
  const [editableLinks, setEditableLinks] = useState([...linksData]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(editableLinks) !== JSON.stringify(linksData));
  }, [editableLinks, linksData]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'category') {
      const updatedCategories = [...editableLinks];
      const [movedCategory] = updatedCategories.splice(source.index, 1);
      updatedCategories.splice(destination.index, 0, movedCategory);
      setEditableLinks(updatedCategories);
    } else if (type === 'link') {
      const categoryIndex = parseInt(result.source.droppableId, 10);
      const updatedCategories = [...editableLinks];
      const links = [...updatedCategories[categoryIndex].links];

      const [movedLink] = links.splice(source.index, 1);
      links.splice(destination.index, 0, movedLink);

      updatedCategories[categoryIndex].links = links;
      setEditableLinks(updatedCategories);
    }
  };

  const addLink = (categoryIndex) => {
    setEditableLinks((prevLinks) => {
      return prevLinks.map((category, index) => {
        if (index === categoryIndex) {
          return {
            ...category,
            links: [...category.links, { label: 'New Link', url: 'https://' }]
          };
        }
        return category;
      });
    });
  };

  const saveChanges = () => {
    if (editableLinks.length === 0) return;
    setLinksData(editableLinks);
    localStorage.setItem('linksData', JSON.stringify(editableLinks));
    closeModal();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Links</h2>
        <button className={styles.closeButton} onClick={closeModal}>✖</button>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories" type="category">
            {(provided) => (
              <div className={styles.editContainer} {...provided.droppableProps} ref={provided.innerRef}>
                {editableLinks.map((category, categoryIndex) => (
                  <Draggable key={categoryIndex} draggableId={`category-${categoryIndex}`} index={categoryIndex}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} className={styles.category}>
                        <div className={styles.categoryHeader} {...provided.dragHandleProps}>
                          <input
                            type="text"
                            className={styles.categoryInput}
                            value={category.heading}
                            onChange={(e) => {
                              setEditableLinks((prevLinks) =>
                                prevLinks.map((cat, index) =>
                                  index === categoryIndex ? { ...cat, heading: e.target.value } : cat
                                )
                              );
                            }}
                          />
                          <button className={styles.deleteButton} onClick={() => {
                            setEditableLinks(editableLinks.filter((_, index) => index !== categoryIndex));
                          }}>
                            <FaTrashAlt />
                          </button>
                        </div>

                        <Droppable droppableId={`${categoryIndex}`} type="link">
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                              {category.links.map((link, linkIndex) => (
                                <Draggable key={linkIndex} draggableId={`link-${categoryIndex}-${linkIndex}`} index={linkIndex}>
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.link}>
                                      <input
                                        type="text"
                                        className={styles.input}
                                        value={link.label}
                                        placeholder="Label"
                                        onChange={(e) => {
                                          setEditableLinks((prevLinks) =>
                                            prevLinks.map((cat, catIdx) =>
                                              catIdx === categoryIndex
                                                ? {
                                                    ...cat,
                                                    links: cat.links.map((lnk, lnkIdx) =>
                                                      lnkIdx === linkIndex ? { ...lnk, label: e.target.value } : lnk
                                                    ),
                                                  }
                                                : cat
                                            )
                                          );
                                        }}
                                      />
                                      <input
                                        type="text"
                                        className={styles.input}
                                        value={link.url}
                                        placeholder="URL"
                                        onChange={(e) => {
                                          setEditableLinks((prevLinks) =>
                                            prevLinks.map((cat, catIdx) =>
                                              catIdx === categoryIndex
                                                ? {
                                                    ...cat,
                                                    links: cat.links.map((lnk, lnkIdx) =>
                                                      lnkIdx === linkIndex ? { ...lnk, url: e.target.value } : lnk
                                                    ),
                                                  }
                                                : cat
                                            )
                                          );
                                        }}
                                      />
                                      <button className={styles.deleteButton} onClick={() => {
                                        setEditableLinks((prevLinks) =>
                                          prevLinks.map((cat, catIdx) =>
                                            catIdx === categoryIndex
                                              ? { ...cat, links: cat.links.filter((_, lnkIdx) => lnkIdx !== linkIndex) }
                                              : cat
                                          )
                                        );
                                      }}>
                                        <FaTrashAlt />
                                      </button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <button className={styles.addLinkButton} onClick={() => addLink(categoryIndex)}>
                          + Add Link
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button className={styles.addCategoryButton} onClick={() => {
          setEditableLinks([...editableLinks, { heading: 'New Category', links: [] }]);
        }}>
          + Add Category
        </button>

        {hasChanges && (
          <div className={styles.unsaved}>You have unsaved changes.</div>
        )}

        <button
          className={styles.saveButton}
          onClick={saveChanges}
          disabled={!hasChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LinksModal;