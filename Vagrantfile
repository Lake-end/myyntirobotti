# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # Set the box used by Vagrant to the newest version of Ubuntu.
  config.vm.box = "bento/ubuntu-16.04"

  # Sync the project folder.
  config.vm.synced_folder "./", "/var/www/myyntirobotti", create: true

  # Forward ports.
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  # Install and configure required packages.
  config.vm.provision "shell", inline: <<-SHELL
    -- Change this to use another version of PostgreSQL.
    PG_VERSION=9.5

    apt-get update
    apt-get install curl
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    apt-get install nodejs -y
    apt-get install npm -y
    apt-get install postgresql-$PG_VERSION -y

    -- Symlink so it is possible to run nodejs using command "node".
    sudo ln -s `which nodejs` /usr/bin/node

    -- Setup PostgreSQL.
    PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
    PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
    echo "host    all             all             all                     md5" >> "$PG_HBA"
    service postgresql restart
    cat << EOF | su - postgres -c psql
    CREATE USER myyntirobotti WITH PASSWORD 'myyntirobotti';
    CREATE DATABASE myyntirobotti WITH OWNER=myyntirobotti
      LC_COLLATE='en_US.utf8'
      LC_CTYPE='en_US.utf8'
      ENCODING='UTF8'
      TEMPLATE=template0;
    CREATE DATABASE myyntirobotti_test WITH OWNER=myyntirobotti
      LC_COLLATE='en_US.utf8'
      LC_CTYPE='en_US.utf8'
      ENCODING='UTF8'
      TEMPLATE=template0;
EOF
  SHELL

end
