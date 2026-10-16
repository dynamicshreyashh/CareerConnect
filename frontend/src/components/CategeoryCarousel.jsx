import { Code2, Database, Layers3, LineChart, Megaphone, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
  { label: "Frontend Developer", icon: Code2 },
  { label: "Backend Developer", icon: Database },
  { label: "Full Stack Developer", icon: Layers3 },
  { label: "Data Scientist", icon: LineChart },
  { label: "Product Manager", icon: Megaphone },
  { label: "DevOps Engineer", icon: ShieldCheck },
];

const CategeoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="cc-category-section">
      <div className="cc-category-inner">
        <div><span className="cc-category-label">EXPLORE BY EXPERTISE</span><h2 className="cc-category-title">What do you want to build?</h2></div>
        <div className="cc-category-list">
          {categories.map(({ label, icon: Icon }) => <button className="cc-category-chip" type="button" key={label} onClick={() => searchJobHandler(label)}><Icon size={15} />{label}</button>)}
        </div>
      </div>
    </section>
  );
};

export default CategeoryCarousel;
