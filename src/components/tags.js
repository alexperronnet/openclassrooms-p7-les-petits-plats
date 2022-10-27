export function Tags(event, category, filterList) {
  // Get value
  const filterItemValue = event.target.parentElement.dataset.value

  // Create template
  const template = document.createElement('template')

  // Set template
  template.innerHTML = `
    <li class="tags__item" data-value="${filterItemValue}" data-category="${category}">
      <button class="tags__item-button">
        <span class="tags__item-button-text">${filterItemValue}</span>
        <svg class="tags__item-button-icon">
          <use xlink:href="assets/sprite.svg#icon-close" />
        </svg>
      </button>
    </li>
  `

  // Append
  document.querySelector('.tags__list').append(template.content.cloneNode(true))

  // If no-tags, remove no-tags
  document.querySelector('.tags').hasAttribute('no-tags') && document.querySelector('.tags').removeAttribute('no-tags')

  // Set state
  event.target.parentElement.setAttribute('selected', '')
  event.target.disabled = true

  // On click, remove tag
  document.querySelector('.tags__list').lastElementChild.addEventListener('click', event => {
    // Get value
    const tagValue = event.target.closest('.tags__item').dataset.value

    // Remove tag
    event.target.closest('.tags__item').remove()

    // Set state
    filterList.querySelector(`[data-value="${tagValue}"]`).removeAttribute('selected')
    filterList.querySelector(`[data-value="${tagValue}"] button`).disabled = false

    // If no tags, add no-tags
    document.querySelector('.tags__list').children.length === 0 &&
      document.querySelector('.tags').setAttribute('no-tags', '')
  })

  // On click on reset button, remove all tags
  document.querySelector('.tags__reset').addEventListener('click', event => {
    // Remove tags
    document.querySelectorAll('.tags__item').forEach(tag => tag.remove())

    // Set state
    filterList.querySelectorAll('.filter__item').forEach(filterItem => {
      filterItem.removeAttribute('selected')
      filterItem.querySelector('button').disabled = false
    })

    // If no tags, add no-tags
    document.querySelector('.tags__list').children.length === 0 &&
      document.querySelector('.tags').setAttribute('no-tags', '')
  })
}
