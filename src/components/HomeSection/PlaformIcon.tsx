interface CustomIconProps {
  urlImage: string;
  plaformDescription: string;
}
export function PlaformIcon({ urlImage, plaformDescription }: CustomIconProps) {
  return (
    <div className=" border-2 rounded-sm px-2 py-1 ">
      <a href="" className="flex flex-row items-center space-x-3">
        <img src={urlImage} alt="Icon" className="w-8" />
        <span className="text-white font-grandstander">
          {plaformDescription.toUpperCase()}
        </span>
      </a>
    </div>
  );
}
