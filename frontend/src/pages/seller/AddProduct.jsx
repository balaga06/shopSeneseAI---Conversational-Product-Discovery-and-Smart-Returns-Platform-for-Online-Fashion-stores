import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/api"


// ======================================================
// DEFAULT PRODUCT SIZES
// ======================================================

const DEFAULT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
]


// ======================================================
// IMAGE URL HELPER
// ======================================================

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return ""
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl
  }

  return `http://127.0.0.1:8000${imageUrl}`
}


// ======================================================
// ADD PRODUCT
// ======================================================

function AddProduct() {

  const navigate = useNavigate()


  // ====================================================
  // BASIC PRODUCT STATE
  // ====================================================

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    brand: "",
    category_id: "",
    gender: "UNISEX",
    color: "",
    material: "",
    fit_type: "",
    occasion: "",
    price: "",
    discount_price: "",
    product_status: "ACTIVE",
  })


  // ====================================================
  // CATEGORIES
  // ====================================================

  const [categories, setCategories] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(false)


  // ====================================================
  // IMAGE
  // ====================================================

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [imageUploading, setImageUploading] = useState(false)


  // ====================================================
  // SIZE / INVENTORY
  // ====================================================

  const [sizes, setSizes] = useState(
    DEFAULT_SIZES.map((size) => ({
      size,
      stock: "",
      chest_min: "",
      chest_max: "",
      waist_min: "",
      waist_max: "",
      hip_min: "",
      hip_max: "",
    }))
  )


  // ====================================================
  // UI STATE
  // ====================================================

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")


  // ====================================================
  // LOAD CATEGORIES
  // ====================================================

  useEffect(() => {

    const loadCategories = async () => {

      setCategoryLoading(true)

      try {

        const response = await api.get("/categories")

        console.log("Categories:", response.data)

        setCategories(response.data || [])

      } catch (error) {

        console.error(
          "Category loading error:",
          error
        )

        setCategories([])

      } finally {

        setCategoryLoading(false)

      }

    }

    loadCategories()

  }, [])


  // ====================================================
  // HANDLE BASIC INPUT
  // ====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

  }


  // ====================================================
  // HANDLE IMAGE SELECTION
  // ====================================================

  const handleImageChange = (event) => {

    const file = event.target.files?.[0]

    setError("")
    setSuccess("")


    if (!file) {
      return
    }


    // --------------------------------------------------
    // VALIDATE FILE TYPE
    // --------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Only JPG, PNG and WEBP images are allowed."
      )

      event.target.value = ""

      return
    }


    // --------------------------------------------------
    // VALIDATE FILE SIZE
    // --------------------------------------------------

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {

      setError(
        "Image size must be less than 5 MB."
      )

      event.target.value = ""

      return
    }


    // --------------------------------------------------
    // SAVE FILE
    // --------------------------------------------------

    setImageFile(file)


    // --------------------------------------------------
    // CREATE LOCAL PREVIEW
    // FileReader creates a data URL for reliable
    // browser-side image preview.
    // --------------------------------------------------

    const reader = new FileReader()

    reader.onload = () => {

      setImagePreview(reader.result)

    }

    reader.onerror = () => {

      setImagePreview("")

      setError(
        "Unable to preview the selected image."
      )

    }

    reader.readAsDataURL(file)

  }


  // ====================================================
  // REMOVE IMAGE
  // ====================================================

  const handleRemoveImage = () => {

    setImageFile(null)

    setImagePreview("")

  }


  // ====================================================
  // HANDLE SIZE CHANGE
  // ====================================================

  const handleSizeChange = (
    index,
    field,
    value
  ) => {

    setSizes((previousSizes) => {

      const updatedSizes = [
        ...previousSizes,
      ]

      updatedSizes[index] = {
        ...updatedSizes[index],
        [field]: value,
      }

      return updatedSizes

    })

  }


  // ====================================================
  // VALIDATE FORM
  // ====================================================

  const validateForm = () => {

    if (!formData.product_name.trim()) {
      return "Product name is required."
    }

    if (!formData.description.trim()) {
      return "Product description is required."
    }

    if (!formData.category_id) {
      return "Please select a category."
    }

    if (!formData.brand.trim()) {
      return "Brand is required."
    }

    if (!formData.color.trim()) {
      return "Color is required."
    }

    if (!formData.price) {
      return "Product price is required."
    }

    if (Number(formData.price) <= 0) {
      return "Product price must be greater than 0."
    }

    if (
      formData.discount_price &&
      Number(formData.discount_price) >=
        Number(formData.price)
    ) {

      return "Discount price must be less than the original price."

    }

    if (!imageFile) {
      return "Please select a product image."
    }

    return ""

  }


  // ====================================================
  // UPLOAD IMAGE
  // ====================================================

  const uploadImage = async () => {

    if (!imageFile) {
      return null
    }

    setImageUploading(true)

    try {

      const imageFormData = new FormData()

      imageFormData.append(
        "file",
        imageFile
      )


      const response = await api.post(
        "/media/upload",
        imageFormData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )


      console.log(
        "Image upload response:",
        response.data
      )


      return response.data.image_url

    } catch (error) {

      console.error(
        "Image upload error:",
        error
      )

      throw new Error(
        error.response?.data?.detail ||
        "Failed to upload product image."
      )

    } finally {

      setImageUploading(false)

    }

  }


  // ====================================================
  // SUBMIT PRODUCT
  // ====================================================

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError("")
    setSuccess("")


    // --------------------------------------------------
    // VALIDATE
    // --------------------------------------------------

    const validationError =
      validateForm()

    if (validationError) {

      setError(validationError)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })

      return

    }


    setLoading(true)


    try {

      // ------------------------------------------------
      // STEP 1: UPLOAD IMAGE
      // ------------------------------------------------

      const uploadedImageUrl =
        await uploadImage()


      console.log(
        "Uploaded image URL:",
        uploadedImageUrl
      )


      // ------------------------------------------------
      // STEP 2: PREPARE SIZE DATA
      // ------------------------------------------------

      const productSizes = sizes

        .filter(
          (item) =>
            item.stock !== "" &&
            Number(item.stock) >= 0
        )

        .map((item) => ({

          size_code: item.size,

          stock: Number(item.stock),

          chest_min:
            item.chest_min === ""
              ? null
              : Number(item.chest_min),

          chest_max:
            item.chest_max === ""
              ? null
              : Number(item.chest_max),

          waist_min:
            item.waist_min === ""
              ? null
              : Number(item.waist_min),

          waist_max:
            item.waist_max === ""
              ? null
              : Number(item.waist_max),

          hip_min:
            item.hip_min === ""
              ? null
              : Number(item.hip_min),

          hip_max:
            item.hip_max === ""
              ? null
              : Number(item.hip_max),

          height_min: null,

          height_max: null,

        }))


      // ------------------------------------------------
      // STEP 3: CALCULATE TOTAL STOCK
      // ------------------------------------------------

      const totalStock =
        productSizes.reduce(
          (total, item) =>
            total + Number(item.stock || 0),
          0
        )


      console.log(
        "Total stock:",
        totalStock
      )


      // ------------------------------------------------
      // STEP 4: CREATE PRODUCT
      // ------------------------------------------------

      const productPayload = {

        product_name:
          formData.product_name.trim(),

        description:
          formData.description.trim(),

        brand:
          formData.brand.trim(),

        category_id:
          Number(formData.category_id),

        gender:
          formData.gender,

        color:
          formData.color.trim(),

        material:
          formData.material.trim(),

        fit_type:
          formData.fit_type.trim(),

        occasion:
          formData.occasion.trim(),

        price:
          Number(formData.price),

        discount_price:
          formData.discount_price
            ? Number(formData.discount_price)
            : null,

        image_url:
          uploadedImageUrl,

        product_status:
          formData.product_status,

        stock:
          totalStock,

        sizes:
          productSizes,

      }


      console.log(
        "================================="
      )

      console.log(
        "PRODUCT PAYLOAD:"
      )

      console.log(
        JSON.stringify(
          productPayload,
          null,
          2
        )
      )

      console.log(
        "================================="
      )


      // ------------------------------------------------
      // STEP 5: SAVE PRODUCT
      // ------------------------------------------------

      const response = await api.post(
        "/seller/products",
        productPayload
      )


      console.log(
        "Product created:",
        response.data
      )


      setSuccess(
        "Product added successfully!"
      )


      // ------------------------------------------------
      // REDIRECT TO PRODUCTS
      // ------------------------------------------------

      setTimeout(() => {

        navigate(
          "/seller/products"
        )

      }, 1200)


    } catch (error) {

      console.error(
        "Add product error:",
        error
      )


      console.error(
        "Response:",
        error.response?.data
      )


      setError(
        error.response?.data?.detail ||
        error.message ||
        "Failed to add product."
      )


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })


    } finally {

      setLoading(false)

    }

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="min-h-screen bg-gray-100">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white">

        <div className="border-b border-slate-700 px-6 py-5">

          <h1 className="text-xl font-bold">
            ShopSense AI
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Seller Panel
          </p>

        </div>


        <nav className="space-y-1 p-4">

          <Link
            to="/seller/dashboard"
            className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            Dashboard
          </Link>


          <Link
            to="/seller/products"
            className="block rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium"
          >
            Products
          </Link>


          <Link
            to="/seller/products/add"
            className="block rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium"
          >
            + Add Product
          </Link>


          <Link
            to="/seller/orders"
            className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            Orders
          </Link>


          <Link
            to="/seller/returns"
            className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            Returns
          </Link>


          <Link
            to="/seller/analytics"
            className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            Analytics
          </Link>


          <Link
            to="/seller/profile"
            className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
          >
            Profile
          </Link>

        </nav>

      </aside>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="ml-64 min-h-screen">


        {/* ==================================================
            TOP BAR
        ================================================== */}

        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-8 py-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Add Product
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new product to your store
            </p>

          </div>


          <Link
            to="/seller/products"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back to Products
          </Link>

        </header>


        {/* ==================================================
            FORM AREA
        ================================================== */}

        <div className="mx-auto max-w-6xl p-8">


          {/* SUCCESS MESSAGE */}

          {success && (

            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">

              ✓ {success}

            </div>

          )}


          {/* ERROR MESSAGE */}

          {error && (

            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">

              {error}

            </div>

          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >


            {/* ==================================================
                PRODUCT INFORMATION
            ================================================== */}

            <section className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h3 className="text-lg font-bold text-gray-900">
                  Product Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the basic information about your product.
                </p>

              </div>


              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


                {/* PRODUCT NAME */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="Example: Premium Cotton Casual Shirt"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe the product, material, comfort, style, features, etc."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* BRAND */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Brand *
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Example: Levi's"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category *
                  </label>

                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={categoryLoading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="">

                      {categoryLoading
                        ? "Loading categories..."
                        : "Select Category"}

                    </option>


                    {categories.map(
                      (category) => (

                        <option
                          key={
                            category.category_id ||
                            category.id
                          }
                          value={
                            category.category_id ||
                            category.id
                          }
                        >

                          {
                            category.category_name ||
                            category.name
                          }

                        </option>

                      )
                    )}

                  </select>


                  {!categoryLoading &&
                    categories.length === 0 && (

                      <p className="mt-2 text-xs text-orange-600">
                        No categories available. Make sure the backend
                        `/api/categories` endpoint is running.
                      </p>

                    )}

                </div>


                {/* GENDER */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="UNISEX">
                      Unisex
                    </option>

                    <option value="MEN">
                      Men
                    </option>

                    <option value="WOMEN">
                      Women
                    </option>

                  </select>

                </div>


                {/* COLOR */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Color *
                  </label>

                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Example: Black"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* MATERIAL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Material
                  </label>

                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="Example: 100% Cotton"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* FIT */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Fit Type
                  </label>

                  <select
                    name="fit_type"
                    value={formData.fit_type}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="">
                      Select Fit
                    </option>

                    <option value="SLIM">
                      Slim Fit
                    </option>

                    <option value="REGULAR">
                      Regular Fit
                    </option>

                    <option value="RELAXED">
                      Relaxed Fit
                    </option>

                    <option value="OVERSIZED">
                      Oversized
                    </option>

                  </select>

                </div>


                {/* OCCASION */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Occasion
                  </label>

                  <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    placeholder="Example: Casual, Party, Office"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

              </div>

            </section>


            {/* ==================================================
                PRODUCT IMAGE
            ================================================== */}

            <section className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h3 className="text-lg font-bold text-gray-900">
                  Product Image
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Upload a product image from your computer.
                </p>

              </div>


              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">


                {/* UPLOAD */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Choose Image *
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-indigo-600 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
                  />

                  <p className="mt-3 text-xs text-gray-500">
                    Supported formats: JPG, PNG, WEBP
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Maximum file size: 5 MB
                  </p>


                  {imageFile && (

                    <div className="mt-4 rounded-lg bg-gray-50 p-4">

                      <p className="text-sm font-medium text-gray-700">
                        Selected file:
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-500">
                        {imageFile.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Remove Image
                      </button>

                    </div>

                  )}

                </div>


                {/* PREVIEW */}

                <div>

                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Image Preview
                  </p>

                  <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">

                    {imagePreview ? (

                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-full w-full object-contain"
                        onError={(event) => {
                          console.error(
                            "Image preview failed:",
                            event
                          )
                        }}
                      />

                    ) : (

                      <div className="text-center">

                        <div className="text-4xl">
                          📷
                        </div>

                        <p className="mt-2 text-sm text-gray-400">
                          Image preview will appear here
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </section>


            {/* ==================================================
                PRICE
            ================================================== */}

            <section className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h3 className="text-lg font-bold text-gray-900">
                  Pricing
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Set the product selling price and optional discount.
                </p>

              </div>


              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">


                {/* PRICE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    placeholder="1999"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* DISCOUNT */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Price (₹)
                  </label>

                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="1499"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>


                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Product Status
                  </label>

                  <select
                    name="product_status"
                    value={formData.product_status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

            </section>


            {/* ==================================================
                SIZE & INVENTORY
            ================================================== */}

            <section className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h3 className="text-lg font-bold text-gray-900">
                  Size & Inventory
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enter stock and measurement ranges for each size.
                  These measurements will help the AI size recommendation.
                </p>

              </div>


              <div className="overflow-x-auto">

                <table className="min-w-full border-collapse">

                  <thead>

                    <tr className="border-b bg-gray-50 text-left">

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Size
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Stock
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Chest Min
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Chest Max
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Waist Min
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Waist Max
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Hip Min
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">
                        Hip Max
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {sizes.map(
                      (item, index) => (

                        <tr
                          key={item.size}
                          className="border-b"
                        >

                          <td className="px-4 py-3">

                            <span className="inline-flex min-w-12 justify-center rounded-lg bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700">
                              {item.size}
                            </span>

                          </td>


                          <td className="px-4 py-3">

                            <input
                              type="number"
                              min="0"
                              value={item.stock}
                              onChange={(event) =>
                                handleSizeChange(
                                  index,
                                  "stock",
                                  event.target.value
                                )
                              }
                              placeholder="0"
                              className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                          </td>


                          <td className="px-4 py-3">

                            <input
                              type="number"
                              min="0"
                              value={item.chest_min}
                              onChange={(event) =>
                                handleSizeChange(
                                  index,
                                  "chest_min",
                                  event.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                          </td>


                          <td className="px-4 py-3">

                            <input
                              type="number"
                              min="0"
                              value={item.chest_max}
                              onChange={(event) =>
                                handleSizeChange(
                                  index,
                                  "chest_max",
                                  event.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                          </td>


                          <td className="px-4 py-3">

                            <input
                              type="number"
                              min="0"
                              value={item.waist_min}
                              onChange={(event) =>
                                handleSizeChange(
                                  index,
                                  "waist_min",
                                  event.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                          </td>


                          <td className="px-4 py-3">

                            <input
                              type="number"
                              min="0"
                              value={item.waist_max}
                              onChange={(event) =>
                                handleSizeChange(
                                  index,
                                  "waist_max",
                                  event.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                          </td>


                          <td className="px-4 py-3">

                            <input
                              type="number"
                              min="0"
                              value={item.hip_min}
                              onChange={(event) =>
                                handleSizeChange(
                                  index,
                                  "hip_min",
                                  event.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                          </td>


                          <td className="px-4 py-3">

                            <input
                              type="number"
                              min="0"
                              value={item.hip_max}
                              onChange={(event) =>
                                handleSizeChange(
                                  index,
                                  "hip_max",
                                  event.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </section>


            {/* ==================================================
                AI INFORMATION
            ================================================== */}

            <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-6">

              <div className="flex gap-4">

                <div className="text-3xl">
                  🤖
                </div>

                <div>

                  <h3 className="font-bold text-indigo-900">
                    AI Size Recommendation
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-indigo-800">
                    The chest, waist and hip measurement ranges entered
                    above will be used by ShopSense AI to recommend the
                    best size for customers based on their saved body
                    measurements and preferred fit.
                  </p>

                </div>

              </div>

            </section>


            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

              <Link
                to="/seller/products"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>


              <button
                type="submit"
                disabled={
                  loading ||
                  imageUploading
                }
                className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {imageUploading
                  ? "Uploading Image..."
                  : loading
                    ? "Adding Product..."
                    : "Add Product"}

              </button>

            </div>


          </form>

        </div>

      </main>

    </div>

  )

}


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default AddProduct