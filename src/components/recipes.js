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

      // Remove quantity if not a number
      isNaN(ingredient.quantity) &&
        ingredientTemplate.content.querySelector('.recipe-card__ingredient-quantity').remove()

      // Append ingredient to list
      ingredients.append(ingredientTemplate.content.cloneNode(true))
    })

    // Append card
    recipes.append(cardClone)

    // On click on card create dialog
    card.addEventListener('click', event => event.preventDefault() || Modal(card, recipe))

    // Browse recipes with arrow keys left/right
    card.addEventListener('keydown', event => {
      const allRecipes = Array.from(recipes.querySelectorAll('.recipe-card:not([hidden])'))
      const index = allRecipes.indexOf(card)
      const lastIndex = allRecipes.length - 1

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        index === lastIndex ? allRecipes[0].focus() : allRecipes[index + 1].focus()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        index === 0 ? allRecipes[lastIndex].focus() : allRecipes[index - 1].focus()
      }
    })
  })
}
