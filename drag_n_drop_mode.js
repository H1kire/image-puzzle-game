export function enableDragMode(tile, index, handlers) {
    tile.draggable = true;

    tile.addEventListener("dragstart", () => {
        handlers.onStart(index);
        tile.classList.add("dragging");
    });

    tile.addEventListener("dragend", () => {
        tile.classList.remove("dragging");
    });

    tile.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    tile.addEventListener("drop", () => {
        handlers.onDrop(index);
    });
}