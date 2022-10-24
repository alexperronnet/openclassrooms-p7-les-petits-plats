// Import data source
import dataSource from '@/data/recipes.json'

export function GetData() {
  // Parse data source
  const recipes = dataSource.recipes

  // Format string
  const FormatString = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

  // Loop through recipes
  recipes.forEach(recipe => {
    // Rewrite properties
    recipe.name = FormatString(recipe.name)
    recipe.compositions = recipe.ingredients
    recipe.ingredients = recipe.compositions.map(composition => FormatString(composition.ingredient))
    recipe.appliance = [FormatString(recipe.appliance)]
    recipe.ustensils = recipe.ustensils.map(ustensil => FormatString(ustensil))

    // Loop through compositions
    recipe.compositions.forEach(composition => {
      // Rewrite properties
      composition.ingredient = FormatString(composition.ingredient)
    })

    // Create thumbnail
    recipe.thumbnail = `assets/thumbnails/recipe-${recipe.id}.webp`

    // Create keywords
    recipe.filters = [...recipe.ingredients, ...recipe.appliance, ...recipe.ustensils]
  })

  recipes.filters = {
    ingredients: [...new Set(recipes.map(recipe => recipe.ingredients).flat())],
    appliances: [...new Set(recipes.map(recipe => recipe.appliance).flat())],
    ustensils: [...new Set(recipes.map(recipe => recipe.ustensils).flat())]
  }

  // Return recipes
  return recipes
}
