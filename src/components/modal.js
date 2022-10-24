export function Modal(card, recipe) {
  // Disable scroll
  document.body.style.overflow = 'hidden'

  // Get template
  const modalTemplate = document.querySelector('#recipe-modal-template')

  // Clone template
  const modalClone = modalTemplate.content.cloneNode(true)

  // Get elements
  const modal = modalClone.querySelector('.recipe-modal')
  const modalThumbnail = modalClone.querySelector('.recipe-modal__thumbnail')
  const modalClose = modalClone.querySelector('.recipe-modal__close')
  const modalTitle = modalClone.querySelector('.recipe-modal__title')
  const modalTime = modalClone.querySelector('.recipe-modal__time')
  const modalTimeValue = modalClone.querySelector('.recipe-modal__time-value')
  const modalServingsCount = modalClone.querySelector('.recipe-modal__servings-count')
  const modalServingsDecrease = modalClone.getElementById('decrease-servings')
  const modalServingsIncrease = modalClone.getElementById('increase-servings')
  const modalIngredients = modalClone.querySelector('.recipe-modal__ingredients-list')
  const modalApplianceUstensils = modalClone.querySelector('.recipe-modal__appliance-ustensils-list')
  const modalDescription = modalClone.querySelector('.recipe-modal__description-text')

  // Set values
  modalThumbnail.src = recipe.thumbnail
  modalThumbnail.alt = recipe.name
  modalTitle.textContent = recipe.name
  recipe.time === 0 ? modalTime.remove() : (modalTimeValue.textContent = `${recipe.time} min`)
  modalServingsCount.textContent = recipe.servings
  modalDescription.textContent = recipe.description

  // Loop through compositions
  recipe.compositions.forEach((ingredient, index) => {
    // Create template
    const ingredientTemplate = document.createElement('template')

    // Set template
    ingredientTemplate.innerHTML = `
      <li class="recipe-modal__ingredient">
        <input type="checkbox" class="recipe-modal__ingredient-checkbox" id="ingredient-${index}" />
        <label for="ingredient-${index}" class="recipe-modal__ingredient-label">
          <span class="recipe-modal__ingredient-name">${ingredient.ingredient}</span>
          <span class="recipe-modal__ingredient-quantity">${ingredient.quantity} ${ingredient.unit || ''}</span>
        </label>
      </li>
    `

    // Remove quantity if undefined
    ingredient.quantity === undefined &&
      ingredientTemplate.content.querySelector('.recipe-modal__ingredient-quantity').remove()

    // Append ingredient to list
    modalIngredients.append(ingredientTemplate.content.cloneNode(true))
  })

  // Create an array of all the appliances and ustensils
  const appliancesUstensils = [...recipe.appliance, ...recipe.ustensils]

  // Loop through appliances and ustensils
  appliancesUstensils.forEach(applianceUstensil => {
    // Create template
    const applianceUstensilTemplate = document.createElement('template')

    // Set template
    applianceUstensilTemplate.innerHTML = `
          <li class="recipe-modal__appliance-ustensils-item">${applianceUstensil}</li>
        `

    // Append appliance or ustensil to list
    modalApplianceUstensils.append(applianceUstensilTemplate.content.cloneNode(true))
  })

  // Append dialog
  document.querySelector('#main').append(modalClone)

  // Open dialog
  modal.showModal()

  // Close dialog
  const CloseModal = () => {
    modal.setAttribute('closing', '')

    modal.addEventListener(
      'animationend',
      () => {
        modal.removeAttribute('closing')
        modal.remove()

        // Enable scroll
        document.body.removeAttribute('style')

        // Focus on recipe card
        card.focus()
      },
      { once: true }
    )
  }

  // Event to close dialog
  modalClose.addEventListener('click', CloseModal)
  modal.addEventListener('click', event => event.target === modal && CloseModal())
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      CloseModal()
    }
  })

  // Update servings
  const UpdateServings = type => {
    // Get default servings
    const defaultServings = recipe.servings

    // Base multiplier
    let multiplier = 1

    // Increase servings
    if (type === 'increase') {
      modalServingsCount.textContent === defaultServings
        ? (multiplier = 2)
        : (multiplier = parseInt(modalServingsCount.textContent) / defaultServings + 1)

      modalServingsCount.textContent = defaultServings * multiplier
      modalServingsDecrease.removeAttribute('disabled')

      multiplier === 10 && modalServingsIncrease.setAttribute('disabled', '')
    }

    // Decrease servings
    if (type === 'decrease') {
      modalServingsCount.textContent === defaultServings * 2
        ? (multiplier = 1)
        : (multiplier = parseInt(modalServingsCount.textContent) / defaultServings - 1)

      modalServingsCount.textContent = defaultServings * multiplier
      modalServingsIncrease.removeAttribute('disabled')

      multiplier === 1 && modalServingsDecrease.setAttribute('disabled', '')
    }

    // Get ingredients quantity
    const ingredientsQuantity = modalIngredients.querySelectorAll('.recipe-modal__ingredient-quantity')

    // Update ingredients quantity
    ingredientsQuantity.forEach((quantity, index) => {
      quantity.textContent = `${recipe.compositions[index].quantity * multiplier} ${
        recipe.compositions[index].unit || ''
      }`
    })

    // Get checked ingredients
    const checkedIngredients = modalIngredients.querySelectorAll('.recipe-modal__ingredient-checkbox:checked')

    // Reset checked ingredients
    checkedIngredients.forEach(ingredient => (ingredient.checked = false))
  }

  // Event to update servings
  modalServingsIncrease.addEventListener('click', () => UpdateServings('increase'))
  modalServingsDecrease.addEventListener('click', () => UpdateServings('decrease'))
}
