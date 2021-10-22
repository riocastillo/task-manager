document.querySelector('#enter').addEventListener('click', addTask)
let buttonArray = document.querySelectorAll('.delete')
buttonArray.forEach(button => {
  button.addEventListener('click', deleteTask)
})

function addTask() {
  let taskAdded = document.querySelector('.task').value
  let nameEntered = document.querySelector('.name').value
  console.log(taskAdded)

  fetch('tasks', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'newTasks': taskAdded,
      'name': nameEntered,
    })
  })
    .then(response => {
      if (response.ok) {
        window.location.reload(true)
      }
    })
}

function deleteTask(e) {
  console.log(e.target.getAttribute('data-id'))
  fetch('tasks', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'taskIdToDelete': e.target.getAttribute('data-id'),
    })
  })
    .then(response => {
      if (response.ok) {
        window.location.reload(true)
      }
    })
}
