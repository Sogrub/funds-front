
interface UserPageProps {
  params: {
    id: string;
  };
}

const UserPage: React.FC<UserPageProps> = ({ params }) => {
  const { id } = params;
  
  return (
    <div>User Page: {id}</div>
  )
}

export default UserPage