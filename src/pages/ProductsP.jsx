
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {  useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../schema/category";
import { request } from "../server/request";
import './Product.css'
import { LazyLoadImage } from "react-lazy-load-image-component";



const ProductsP = () => {
  const { id } = useParams();
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);




  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema) });

  const getData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `https://64b5702bf3dbab5a95c751ee.mockapi.io/api/v1/categgory/${id}/product`,
        { params: { name: search } }
      );
      setProducts(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  }, [id, search]);

  useEffect(() => {
    getData();
  }, [getData]);




  // ---





  // const edit = async (id) => {
  //   let { data } = await axios.get(
  //     `https://64b5702bf3dbab5a95c751ee.mockapi.io/api/v1/categgory/${id}/product/${id}`
  //   );
  //   reset(data);
  //   openModal();
  //   setSelected(id);
  
  // };

  const edit = async (id) => {
    let { data } = await axios.get(
      `https://64b5702bf3dbab5a95c751ee.mockapi.io/api/v1/categgory/${id}/product/${id}`
    );
    reset(data);
    openModal();
    setSelected(id);
  };


  const deleteCategory = async (id) => {
    let check = confirm("Are you sure you want to delete this category?");
    if (check) {
      await axios.delete(
       ` https://64b5702bf3dbab5a95c751ee.mockapi.io/api/v1/categgory/${id}/product/${id}`
      );

      getData();
    }
  };

  
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
 
  }


  const onSubmit = async (data) => {
    try {
      const isValid = await categorySchema.isValid(data);
      if (isValid) {
        if (selected) {
          await request.put(`https://64b5702bf3dbab5a95c751ee.mockapi.io/api/v1/categgory/${id}/product/${selected}`, data);
        } else {
          await request.post(`https://64b5702bf3dbab5a95c751ee.mockapi.io/api/v1/categgory/${id}/product`, data);
        }
        reset();
        getData();
        closeModal();
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  console.log(products);

  return (
    <div className="container  product">
      <div className="input-group my-3">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          className="form-control"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="input-group-text" onClick={openModal}>
          Add
        </button>
      </div>
      <div className="cart cart-product">
        {products.map((product,index) => (
          <div className=" cart category-name" key={product.id}>
          <span>{index + 1}</span>
          <p>
            {product.name} {id}
          </p>
          <div className="cart-body">
            <LazyLoadImage  className="img-lazy" src={product.image}  height={250} />
            <div className="price_title">

            <span className="my-3 product-span text-center">Brthday : {product.createdAt.split('T')[0]}</span>
            <p>{product.title}</p>
            <p>{product.description}  : Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias, corporis!</p>
            </div>
          </div>
          <div className="cart-footer">
            <button className="btn btn-primary" onClick={() => edit(id)}>
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => deleteCategory(id)}
            >
              Delete
            </button>
          </div>
        
        </div>
        ))}
      </div>


      <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group mb-3">
            <input
              {...register("name")}
              type="text"
              className="form-control"
              placeholder="Name"
            />
          </div>
          {errors.name && (
            <p role="alert" className="text-danger">
              {errors.name.message}
            </p>
          )}
          <div className="input-group mb-3">
            <input
              {...register("image")}
              type="text"
              className="form-control"
              placeholder="Image"
            />
          </div>

          
          {errors.image && (
            <p role="alert" className="text-danger">
              {errors.image.message}
            </p>
          )}
          <button className="btn btn-danger me-3" onClick={closeModal}>
            Close
          </button>
          <button type="submit" className="btn btn-success">
            {selected ? "Save" : "Add"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsP;
