import { Seller } from "@/lib/types";
import FriendCard from "./FriendCard";

const dummySellers: Seller[] = [
  {
    id: 'seller1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password123',
    lastName: 'Doe',
    license: 'Seller',
    address: '123 Main St',
    profileImg: 'https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg',
    reviews: [],
    contacts: [],
    products: ['product1', 'product2'],
    stats: [],
    chats: [],
    contactRequests: [],
    wall: {
      id: 'wall1',
      idOwnerSeller: 'seller1',
      postsReferences: ['post1', 'post2']
    }
  },
  {
    id: 'seller2',
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    password: 'password456',
    lastName: 'Smith',
    license: 'Seller',
    address: '',
    profileImg: 'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY=',
    reviews: ['review1', 'review2'],
    contacts: ['contact1', 'contact2'],
    products: [],
    stats: ['stat1', 'stat2'],
    chats: [],
    contactRequests: ['request1', 'request2'],
    wall: {
      id: 'wall2',
      idOwnerSeller: 'seller2',
      postsReferences: []
    }
  },
  // ... more sellers
];
export default function FriendSuggestions() {
  const handleSendRequest = (userId: string) => {
    console.log(`Friend request sent to user ${userId}`)
  }

  return (
    <div className="w-80 max-w-md mx-auto bg-red-300">
      <h2 className="text-2xl font-bold mb-4">People You May Know</h2>
      <div className="space-y-4">
        {dummySellers.map((seller) => (
          <FriendCard seller={seller} onSendRequest={()=>handleSendRequest(seller.id)}/>
        ))}
      </div>
    </div>
  )
}