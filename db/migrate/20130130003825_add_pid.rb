class AddPid < ActiveRecord::Migration
  def up
  	add_column :users, :pid, :integer
  end

  def down
  	remove_column :users, :pid
  end
end
