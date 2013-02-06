class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :protocol, :current_user_name

private
	def authenticate_hootsuite_user
		if (params[:uid].nil? || params[:ts].nil? || params[:token].nil? || ENV["HOOTSUITE_SHARED_SECRET"].nil? || Digest::SHA1.hexdigest(params[:uid] + params[:ts] + ENV["HOOTSUITE_SHARED_SECRET"]) != params[:token])
			render :template => "home/error" 
		end
	end

	def current_user
		@user = User.where("pid = ?", pid)

		if @user[0].nil?
			@user = nil
		else
			@user = @user[0]
		end

		return @user
	end

	def current_user_name
		if current_user
			return current_user.name
		else
			return "No User"
		end
	end

	def protocol
		if request.ssl?
			return "https://"
		else
			return "http://"
		end
	end

	def pid
		if params[:pid].nil? || params[:pid] == ""
			return 1
		else
			return params[:pid]
		end
	end
end
