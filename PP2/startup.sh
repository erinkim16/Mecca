cd scriptorium

# Credit: ChatGPT
if command -v node &> /dev/null
then
    echo "Node.js is installed. Version: $(node -v)"
else
    echo "Node.js is not installed. Please install"
    exit 1
fi

# Credit: ChatGPT
if command -v sqlite3 &> /dev/null
then
    # Print SQLite version if installed
    echo "SQLite is installed. Version: $(sqlite3 --version)"
else
    # Inform the user that SQLite is not installed
    echo "SQLite is not installed. Please install"
    exit 1
fi

npm i
npx prisma generate
node create-admin.js

cd .. 
cd temp_code
docker build -t my-java-env -f Dockerfile.java .
docker build -t my-python-env -f Dockerfile.python .
docker build -t my-javascript-env -f Dockerfile.javascript .
docker build -t my-ruby-env -f Dockerfile.ruby .
docker build -t my-golang-env -f Dockerfile.golang .
docker build -t my-perl-env -f Dockerfile.perl . 
docker build -t my-php-env -f Dockerfile.php .
docker build -t my-swift-env -f Dockerfile.swift . 
docker build -t my-elixir-env -f Dockerfile.elixir .


echo "Startup Complete"