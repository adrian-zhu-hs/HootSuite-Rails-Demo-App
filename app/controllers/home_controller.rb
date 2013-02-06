class HomeController < ApplicationController
  before_filter :authenticate_hootsuite_user

  def index
  	# if not authenticated, redirect to login page, pass all the params along
  	if !current_user
  		redirect_to(params.merge!(:action => "login_page"))
  	end
    
    @tweets = Twitter.new.get_tweets(params[:search_tweets])
  end

  def login_page
  	@pid = params[:pid]
  end
end
