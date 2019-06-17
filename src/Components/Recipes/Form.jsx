import React, { Component } from 'react';
import Categories from './Categories';

class Form extends Component {
  constructor(props) {
    super(props);
    const { recipe } = props;
    const { categories, title, description } = recipe || {};
    this.state = {
      category: '',
      categories: categories || [],
      title: title || '',
      description: description || '',
    };
    this.fileInputRef = React.createRef();
    this.handleSimpleTextBoxChange = this.handleSimpleTextBoxChange.bind(this);
    this.handleCategoriesChange = this.handleCategoriesChange.bind(this);
    this.handleSubmitWrapper = this.handleSubmitWrapper.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { recipe: newRecipe } = this.props;
    const { recipe: oldRecipe } = prevProps;
    if (newRecipe !== oldRecipe) {
      const { categories, title, description, imageURL } = newRecipe || {};
      this.setState({
        category: '',
        categories: categories || [],
        title: title || '',
        description: description || '',
        imageURL: imageURL || '',
      });
    }
  }

  handleSimpleTextBoxChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleCategoriesChange(e) {
    const { value: category } = e.target;
    const { categories } = this.state;

    // If the string has a comma in it, clear the input and add the current category(ies) to the 'categories' array
    if (category.includes(',')) {
      this.setState({ category: '' });
      // Make sure that there is something OTHER than a comma as well
      if (category.length > 1) {
        // want the current 'category' (or multiple), but without the comma at the end. Also, remove any leading/trailing whitespace
        const newCategories = category.split(',').map(item => item.trim());
        const cleanCategories = newCategories.filter(item => item !== '');
        const allCategories = [...categories, ...cleanCategories];
        const newCategoriesState = [...new Set(allCategories)]; // Want only unique categories
        this.setState({ categories: newCategoriesState });
      }
    } else {
      this.setState({
        category,
      });
    }
  }

  handleSubmitWrapper(e) {
    const { categories, title, description, imageURL } = this.state;
    const file = this.fileInputRef.current.files[0];
    const recipe = { categories, title, description, file, imageURL };
    const { handleSubmit } = this.props;
    handleSubmit(e, recipe);
  }

  deleteCategory(ind) {
    const { categories } = this.state;
    const newCategories = categories.splice(ind, 1);

    this.setState = ({ categories: newCategories || [] });
  }

  render() {
    const { category, categories, title, description } = this.state;
    const labelFormat = 'block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2';
    const inputFormat = 'appearance-none block w-full bg-gray-200 text-gray-700 border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-200 focus:bg-white';
    return (
      <form className='mx-auto px-6 sm:px-8 lg:px-12 xl:px-24 lg:max-w-2lg xl:max-w-6xl' onSubmit={this.handleSubmitWrapper}>
        <h1 className='font-bold text-xl'>Add a new recipe!</h1><br />
        {/* Form row 1 */}
        <div className='flex flex-wrap -mx-3 mb-3'>
          {/* Title field */}
          <div className='w-full md:w-2/3 px-3 mb-6 md:mb-0'>
            <label className={labelFormat} htmlFor='grid-title'>
              Title
            </label>
            <input
              className={inputFormat}
              type='text'
              name='title'
              value={title}
              onChange={this.handleSimpleTextBoxChange}
              placeholder='A Delicious Recipe'
            />
          </div>
          {/* Upload image button */}
          <div className='w-full md:w-1/3 px-3'>
            <label className={labelFormat} htmlFor='image-upload-title'>
              Upload a picture
            </label>
            <label className='text-center block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold border-red-500 rounded py-3 px-4 mb-3 leading-tight'>
              <span>Choose a pic!</span>
              <input
                className='hidden'
                name='image'
                type='file'
                ref={this.fileInputRef}
              />
            </label>
          </div>
          {/* Description box */}
          <div className='w-full px-3'>
            <label className={labelFormat} htmlFor='description-title'>
              Description
            </label>
            <textarea
              className={inputFormat}
              style={{ height: 150 }}
              name='description'
              type='text'
              value={description}
              onChange={this.handleSimpleTextBoxChange}
              placeholder='Put any information about your recipe here!'
            />
          </div>
          {/* Categories */}
          <div className='w-full px-3'>
            <label className={labelFormat} htmlFor='categories-title'>
              Categories
            </label>
            <input
              className={inputFormat}
              name='category'
              value={category}
              onChange={this.handleCategoriesChange}
              placeholder='Enter categories, separated by commas'
            />
            <Categories categories={categories} deleteCategory={this.deleteCategory} />
          </div>
          {/* Submit button*/}
          <div className='w-full px-3'>
            <button
              type='submit'
              className='text-center block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold border-red-500 rounded py-3 px-4 mb-3 leading-tight'
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default Form;
