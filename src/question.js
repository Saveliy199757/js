export class Question {
    static create(question) {
      return fetch('https://questions-app-sava.firebaseio.com/question.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
               question.id = question.name
                return question
            })
          .then(addToLocalStorage)
          .then(Question.renderList)
    }

static fetch (token) {
        if (!token) {
            return  Promise.resolve('<p class="error">У вас нет токена</p>')
        }
      return  fetch(`https://questions-app-sava.firebaseio.com/question.json?auth=${token}`)
           .then(response => response.json())
           .then(response => {
             if(response && response.error) {
               return `<p class="error">${response.error}</p>`
             }
             return  response ? Object.keys(response).map( key => ({
                 ...response[key],
                 id: key
             })) : []
           })
}

static renderList() {
       const questions = getQuestionFromLocalStorage()
    const html = questions.length
      ? questions.map(toCard).join('')
        : `<div class="mui--text-headline">От Вас нет вопросов</div>`

    const list = document.getElementById('list')
    list.innerHTML = html
}

static listToHTML (questions) {
        return questions.length
          ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join("")}</ol>`
            : '<p>Вопросов нет</p>'
}

}
function addToLocalStorage(question) {
    const all = getQuestionFromLocalStorage()
    all.push(question)
    localStorage.setItem('question', JSON.stringify(all))
}

function getQuestionFromLocalStorage() {
   return JSON.parse(localStorage.getItem('question') || '[]')
}

function toCard(question) {
    return ` <div class="mui--text-black-54">
 ${new Date(question.date).toLocaleDateString()}
  ${new Date(question.date).toLocaleTimeString()}
</div>
            <div>
        ${question.text}    
</div>`
}