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

  # Install required packages.
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install nodejs -y
    apt-get install npm -y
    apt-get install postgresql -y
  SHELL

end
