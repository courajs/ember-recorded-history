
export function stateForNewEntry(currentState, entry) {
  let { history, position } = currentState;

  let already = history.findIndex((state) => state.uuid === entry.uuid);

  if (already >= 0) {
    return {
      history,
      position: already
    };
  } else {
    history = history.slice(0, position + 1).concat(entry);
    return {
      history,
      position: history.length - 1
    };
  }
}

export function restoreState(loadedState, entry) {
  let position = loadedState.history.findIndex((state) => state.uuid === entry.uuid);

  if (position >= 0) {
    return {
      history: loadedState.history,
      position
    };
  } else {
    return {
      history: [entry],
      position: 0
    };
  }
}
