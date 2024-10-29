import { Seller } from "./types";

export const dummySeller: Seller = {
  id: "seller1",
  name: "001",
  email: "johndoe@example.com",
  password: "password123",
  lastName: "Doe",
  license: "1234567890",
  address: "123 Main St",
  profileImg: "https://example.com/profile.jpg",
  reviews: [
    {
      id: "review1",
      authorRef: "user1",
      ownerRef: "seller1",
      comment: "Great product and service!",
      calification: 5,
    },
    {
      id: "review2",
      authorRef: "user2",
      ownerRef: "seller1",
      comment: "A bit overpriced.",
      calification: 3,
    },
  ],
  contacts: ["contact1", "contact2"],
  products: ["product1", "product2"],
  stats: ["stat1", "stat2"],
  chats: [],
  contactRequests: [],
  wall: {
    id: "wall1",
    idOwnerSeller: "seller1",
    postsReferences: ["post1", "post2"],
  },
};

export const storeSellerToLocalStorage = (seller: Seller) => {
  localStorage.setItem("loggedInSeller", JSON.stringify(seller));
};

export const getLocalSeller = (): Seller => {
  const sellerString = localStorage.getItem("loggedInSeller");
  if (sellerString) {
    console.log("verdad");
    return JSON.parse(sellerString);
  } else return dummySeller;
};
