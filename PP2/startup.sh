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

echo "Startup Complete"