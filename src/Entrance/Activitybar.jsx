import { Link } from "react-router-dom";

function Activitybar() {
    return (
        <>
            <div className="max-w-6xl mx-auto mt-40 flex flex-wrap justify-center  gap-x-8 gap-y-4">
                <Link to="/shop?category=Trekking" className="hover:text-lime-500 px-2">
                    [Trekking]
                </Link>
                <Link to="/shop?category=Camping" className="hover:text-lime-500 px-2">
                    [Camping]
                </Link>
                
                <Link to="/shop?category=Beach-Trips" className="hover:text-lime-500 px-2">
                    [Beach Trips]
                </Link>
                <Link to="/shop?category=Electronics" className="hover:text-lime-500 px-2">
                    [Gadgets]
                </Link>
              
            </div>
        </>
    );
}

export default Activitybar;
