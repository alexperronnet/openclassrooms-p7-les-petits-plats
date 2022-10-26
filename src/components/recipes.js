// Import modal
import { Modal } from '@/components'

export function Recipes(recipeData) {
  // Get elements
  const recipes = document.querySelector('.recipes')
  const cardTemplate = document.querySelector('#recipe-card-template')

  // Loop through recipes
  recipeData.forEach(recipe => {
    // Clone template
    const cardClone = cardTemplate.content.cloneNode(true)

    // Get elements
    const card = cardClone.querySelector('.recipe-card')
    const thumbnail = cardClone.querySelector('.recipe-card__thumbnail')
    const title = cardClone.querySelector('.recipe-card__title')
    const time = cardClone.querySelector('.recipe-card__time')
    const timeValue = cardClone.querySelector('.recipe-card__time-value')
    const ingredients = cardClone.querySelector('.recipe-card__ingredients')
    const description = cardClone.querySelector('.recipe-card__description')

    // Set values
    card.dataset.recipeId = recipe.id
    thumbnail.src = recipe.thumbnail
    thumbnail.alt = recipe.name
    title.textContent = recipe.name
    recipe.time === 0 ? time.remove() : (timeValue.textContent = `${recipe.time} min`)
    description.textContent = recipe.description

    // Loop through compositions
    recipe.compositions.forEach(ingredient => {
      const ingredientTemplate = document.createElement('template')

      ingredientTemplate.innerHTML = `
        <li class="recipe-card__ingredient">
          <span class="recipe-card__ingredient-name">${ingredient.ingredient}</span>
          <span class="recipe-card__ingredient-quantity">${ingredient.quantity} ${ingredient.unit || ''}</span>
        </li>
      `

      // Remove quantity if undefined
      ingredient.quantity === undefined &&
        ingredientTemplate.content.querySelector('.recipe-card__ingredient-quantity').remove()

      // Append ingredient to list
      ingredients.append(ingredientTemplate.content.cloneNode(true))
    })

    // Append card
    recipes.append(cardClone)

    // On click on card create dialog
    card.addEventListener('click', event => event.preventDefault() || Modal(card, recipe))
  })

  // Browse recipes with arrow keys
  recipes.addEventListener('keydown', event => {
    // Browse recipes
    const BrowseRecipes = columnCount => {
      // Prevent default
      event.preventDefault()

      // Get current position
      const currentPosition = Array.from(recipes.children).indexOf(event.target)

      // Get next position
      const nextPosition = recipes.children[currentPosition + columnCount]

      // Focus next position
      nextPosition && nextPosition.focus()
    }

    // Get column count
    const columnCount = getComputedStyle(recipes).gridTemplateColumns.split(' ').length

    event.key === 'ArrowUp' && BrowseRecipes(-columnCount)
    event.key === 'ArrowDown' && BrowseRecipes(columnCount)
    event.key === 'ArrowLeft' && BrowseRecipes(-1)
    event.key === 'ArrowRight' && BrowseRecipes(1)
  })
}
