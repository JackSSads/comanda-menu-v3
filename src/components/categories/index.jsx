import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CInput, CSelect } from "../../components";

import { useLoader } from "../../contexts";

import { Delete, Edit, Plus, Reflesh } from "../../libs/icons";
import { CategoryService } from "../../service/category/CategoryService";

export const Categories = ({ showComponent }) => {
  const { setLoading } = useLoader();

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name_category: "",
    screen: "",
    action: "create",
    category_id: 0,
  });

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = useCallback(() => {
    setLoading(true);
    CategoryService.getAll()
      .then((result) => {
        if (result.length > 0) setCategories(result);

        if (result?.status === false) {
          toast.error(result.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }, []);

  const createCategory = () => {
    if (!newCategory.name_category || !newCategory.screen) {
      return toast.error("Preencha todos os campos.");
    }

    const data = {
      name_category: newCategory.name_category,
      screen: newCategory.screen,
    };

    setLoading(true);
    CategoryService.create(data)
      .then((result) => {
        if (result.status) {
          setNewCategory({ name_category: "", screen: "", action: "create", category_id: 0 });
          getAllCategories();
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const updateCategory = () => {
    if (!newCategory.name_category || !newCategory.screen) {
      return toast.error("Preencha todos os campos.");
    }

    const data = {
      name_category: newCategory.name_category,
      screen: newCategory.screen,
    };

    setLoading(true);
    CategoryService.updateById(newCategory.category_id, data)
      .then((result) => {
        if (result.status) {
          setNewCategory({ name_category: "", screen: "", action: "create", category_id: 0 });
          getAllCategories();
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const deleteCategory = (id) => {
    setLoading(true);
    CategoryService.deleteById(id)
      .then((result) => {
        if (result.status) {
          getAllCategories();
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const handleInput = (field, event) => {
    setNewCategory((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <div className={`w-full max-w-[900px] mx-auto flex flex-col mt-5 px-4 ${showComponent === 2 ? "flex" : "hidden"}`}>
      <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold">
        Categorias
      </h2>

      <div className="overflow-x-auto mt-6 rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-[#1C1D26]">
          <thead className="bg-[#EB8F00] text-white sticky top-0">
            <tr>
              {["Categoria", "Tela", "Ação"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 whitespace-nowrap font-semibold text-center border-r border-orange-300 last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, idx) => (
              <tr
                key={category.category_id}
                className={`border-b border-gray-200 ${idx % 2 === 0 ? "bg-[#FFFDF7]" : "bg-white"
                  } hover:bg-[#FFF4DB] transition-colors`}
              >
                <td className="px-6 py-3 text-center uppercase font-semibold">{category.name_category}</td>
                <td className="px-6 py-3 text-center uppercase font-medium">{category.screen}</td>
                <td className="px-6 py-3 text-center flex justify-center gap-3">
                  <button
                    className="p-2 rounded-md text-white bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-colors"
                    onClick={() =>
                      setNewCategory({
                        name_category: category.name_category,
                        screen: category.screen,
                        action: "update",
                        category_id: category.category_id,
                      })
                    }
                    aria-label={`Editar categoria ${category.name_category}`}
                  >
                    <Edit />
                  </button>
                  <button
                    className="p-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                    onClick={() => deleteCategory(category.category_id)}
                    aria-label={`Deletar categoria ${category.name_category}`}
                  >
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <CInput
          id="name_category"
          name="name_category"
          placeholder="Nome da categoria"
          onChange={(e) => handleInput("name_category", e)}
          value={newCategory.name_category}
        />

        <CSelect
          options={[
            { value: "", label: "Selecione a tela" },
            { value: "bar", label: "Bar" },
            { value: "churrasco", label: "Churrasco" },
            { value: "sem tela", label: "Sem tela" },
          ]}
          onChange={(e) => handleInput("screen", e)}
          value={newCategory.screen}
        />

        <button
          className="flex gap-2 justify-center w-full p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-colors duration-200"
          onClick={() => (newCategory.action === "update" ? updateCategory() : createCategory())}
        >
          {newCategory.action === "update" ? (
            <>
              <Reflesh /> Atualizar categoria
            </>
          ) : (
            <>
              <Plus /> Cadastrar categoria
            </>
          )}
        </button>
      </div>
    </div>
  );
};
