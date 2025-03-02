const Loader = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-around">
      <div className="flex flex-col gap-4 p-10">
        <div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
