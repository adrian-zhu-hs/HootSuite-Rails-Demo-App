class UsersController < ApplicationController
	before_filter :authenticate_hootsuite_user
	
	def create
		# remove any existing users linked to the pid and then create a new one
		User.where("pid = ?", pid).destroy_all
		if @user = User.create(:pid => pid, :name => params[:name])
	  		redirect_to(params.merge!(:controller => "home", :action => "index"))
	  	else
	  		redirect_to(params.merge!(:controller => "home", :action => "login_page"))
	  	end
	end

	def delete
		# given a PID in the params, delete from the database and redirect to the login page
		User.where("pid = ?", pid).destroy_all

		@user = nil

		redirect_to(params.merge!(:controller => "home", :action => "login_page"))
	end

end
