import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../schema/category";
import { request } from "../server/request";

import "./CategoryP.css";

import { Link } from "react-router-dom";

const CategoriesP = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema) });

  const getData = useCallback(async () => {
    try {
      let { data } = await request("categgory", { params: { name: search } });
      console.log(data);
      setCategories(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  }, [search]);

  useEffect(() => {
    getData();
  }, [getData]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const edit = async (id) => {
    let { data } = await request.get(`categgory/${id}`);
    reset(data);
    openModal();
    setSelected(id);
  };

  const deleteCategory = async (id) => {
    let check = confirm("Are you sure you want to delete this category?");
    if (check) {
      await request.delete(`categgory/${id}`);
      getData();
    }
  };

  const onSubmit = async (data) => {
    try {
      const isValid = await categorySchema.isValid(data);
      if (isValid) {
        if (selected) {
          await request.put(`categgory/${selected}`, data);
        } else {
          await request.post("categgory", data);
        }
        reset();
        getData();
        closeModal();
        setSelected;
      }
    } catch (err) {
      console.log(err);
    }
  };



  

  return (
    <div className="container">
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

      <div className="cart cart-category">
        {categories.map(({ name, image, id, title }, index) => (
          <div className=" cart category-name" key={id}>
            <span>{index + 1}</span>
            <p>
              {name} {id}
            </p>
            <div className="cart-body">
              <LazyLoadImage src={image} height={200} />
            </div>
            <p className="my-3 text-center">{title} :: Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
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
            <div className="cart my-3">
              <button className="btn btn-dark">
                <Link className="nav-link" to={`/products/${id}`}>
                  {" "}
                  products card {id}
                </Link>
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

          <div className="input-group mb-3">
            <input
              {...register("name")}
              type="text"
              className="form-control"
              placeholder="title"
            />
          </div>
          {errors.name && (
            <p role="alert" className="text-danger">
              {errors.name.message}
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

export default CategoriesP;
